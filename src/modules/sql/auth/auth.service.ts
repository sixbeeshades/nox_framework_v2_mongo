import fs from 'fs';
import ejs from 'ejs';
import { JwtPayload } from 'jsonwebtoken';
import { Job } from '@src/core/utils/job';
import { EmailService } from '@src/core/modules/email/email.service';
import { LoginLogService } from '@src/modules/mongo/loginLog/loginLog.service';
import { LoginLogModel } from '@src/modules/mongo/loginLog/entity/loginLog.model';
import { User } from '@src/modules/sql/users/entities/user.model';
import { UserService } from '@src/modules/sql/users/users.service';
import { JWTService } from '@src/modules/sql/auth/jwt/jwt.service';
import { uuid } from '@src/core/utils/helpers';

const userService = new UserService(User);
const loginLogService = new LoginLogService(LoginLogModel);
const jwtService = new JWTService();

export class AuthService {
  async registerUser(job: Job) {
    try {
      const emailVerification: boolean =
        process.env.EMAIL_VERIFICATION?.toString() === 'Y';
      const userEmail = job.body?.user?.email;
      const { data: existingUser } = await userService.findOne(
        new Job({
          action: 'findOne',
          options: {
            where: {
              email: userEmail,
            },
          },
        }),
      );

      if (existingUser) {
        return {
          error: 'User already exists.',
          message: 'User already exists.',
        };
      }

      const { data } = await userService.create(
        new Job({
          action: 'create',
          body: {
            uid: uuid(),
            ...job.body?.user,
            verified: !emailVerification,
          },
        }),
      );

      if (emailVerification) {
        const {
          verificationToken,
          message,
          error: sndEmailErr,
          status,
        } = await this.sendVerificationEmail(
          new Job({
            id: data.id,
            body: {
              protocol: job.body?.httpData.protocol,
              host: job.body?.httpData.host,
              toEmail: data.email,
            },
          }),
        );

        if (sndEmailErr) {
          return {
            error: sndEmailErr,
            message: 'Verification Email failed to Send',
          };
        }

        return {
          data: { user: data.dataValues, verificationToken },
          status,
          message,
        };
      }
      const { data: sessionData, error: sessionError } =
        await this.createUserSession(
          new Job({
            id: data.id,
            action: 'createUserSession',
            body: data,
          }),
        );

      if (sessionError) {
        return {
          error: sessionError,
          message: 'Session creation failed',
        };
      }

      return { data: sessionData, status: 'Created', message: 'OK' };
    } catch (error) {
      throw error;
    }
  }

  async createUserSession(job: Job) {
    const _id: any = job.id;
    const { data, error } = await userService.findById(
      new Job({
        action: 'findById',
        id: _id,
      }),
    );

    if (error) {
      return { error: 'Account does not exist' };
    } else {
      if (!data.active) {
        return { error: 'Account is inactive' };
      }
      const token = await jwtService.createToken(_id, '1h');
      const refreshToken = await jwtService.createRefreshToken(_id);

      const loginLogs = await loginLogService.create(
        new Job({
          action: 'create',
          body: {
            user_name: data.name,
            user_id: _id,
          },
        }),
      );

      if (loginLogs.error)
        return { error: true, message: 'Failed to register Login Logs' };

      return {
        error: false,
        data: { token, refreshToken, user: data },
      };
    }
  }

  async sendVerificationEmail(job: Job) {
    try {
      const emailService = new EmailService();
      const template = fs.readFileSync('views/verification_email.ejs', 'utf-8');
      const OTP = Math.floor(100000 + Math.random() * 90000),
        verificationToken = await jwtService.createToken(
          job.id ?? '',
          '10m',
          `${OTP}`,
        ),
        protocol = job.body?.protocol,
        host = job.body?.host,
        verificationLink = `${protocol}://${host}/auth/email-verification/${verificationToken}`,
        htmlBody = ejs.render(template, {
          otp: OTP,
          verificationLink: verificationLink,
        }),
        emailJob = new Job({
          action: 'sendMail',
          payload: {
            toEmail: job.body?.toEmail,
          },
          body: {
            subject: 'NOEX Framework Account Verification Required',
            OTP: OTP,
            link: verificationLink,
            toEmail: job.body?.toEmail,
            htmlBody,
          },
        });
      const { data, message, error } = await emailService.sendEmail(emailJob);
      if (error) {
        return { error: error, status: 404, message: 'Failed to send email' };
      }
      return {
        data: { ...data, verificationToken },
        verificationToken,
        message,
      };
    } catch (error) {
      return { error: error, status: 404, message: 'Failed to send email' };
    }
  }

  async emailVerification(job: Job) {
    try {
      let jwtPayLoad = await jwtService.verifyToken(
        job.body?.token,
        job.body?.otp,
      );
      let tokenVerify = jwtPayLoad as JwtPayload;
      const { data, error } = await userService.update(
        new Job({
          action: 'update',
          id: tokenVerify.userId,
          body: {
            verified: true,
          },
        }),
      );

      if (error) {
        return error;
      }
      return { data };
    } catch (error) {
      return { error };
    }
  }
}
