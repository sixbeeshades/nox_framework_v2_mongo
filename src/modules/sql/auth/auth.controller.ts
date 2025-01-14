import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  BadRequest,
  Created,
  ErrorResponse,
  Result,
  Unauthorized,
} from '@src/core/utils/response';
import { Job } from '@src/core/utils/job';
import { ValidationError } from '@src/core/utils/errors';

const authService = new AuthService();

export class AuthController {
  /* 
    ACTION: Create user
    Credentials: Username, password
    */
  async signup(req: Request, res: Response) {
    const { body, protocol, headers } = req;
    const job = new Job({
      action: 'registerUser',
      body: {
        user: body,
        httpData: {
          protocol,
          host: headers.host,
        },
      },
    });

    const { data, error } = await authService.registerUser(job);

    if (error) {
      if (error instanceof ValidationError) {
        return BadRequest(res, {
          error,
          message: error.message,
        });
      }

      return ErrorResponse(res, {
        error,
        message: `${error.message || error}`,
      });
    }

    return Created(res, {
      data,
      message: 'Created and Verification Email send',
    });
  }

  /* 
    ACTION: Create user
    Credentials: Username, password
    */
  async login(req: Request, res: Response) {
    const user: any = req.user;
    const job = new Job({
      id: user.id,
      body: user,
    });

    const { data, error } = await authService.createUserSession(job);

    if (error) {
      return Unauthorized(res, {
        error,
        message: `login error: ${error}`,
      });
    }

    return Result(res, { data, message: 'Login success' });
  }

  /* 
    ACTION: Send Verification Email
    Credentials: protocol, host, to email
  */
  async sendVerificationEmail(req: Request, res: Response) {
    const job = new Job({
      id: req.params.id,
      body: {
        protocol: req.protocol,
        host: req.headers.host,
        toEmail: req.body.toEmail,
      },
    });
    const { data, message, error } =
      await authService.sendVerificationEmail(job);
    if (error) {
      return ErrorResponse(res, {
        error,
        message: message ?? `${error}`,
      });
    }
    return Result(res, {
      data: { emailRes: data },
      message: message ?? 'Ok',
    });
  }

  /* 
    ACTION: Send Verification Email
    Credentials: token, OTP
  */
  async emailVerification(req: Request, res: Response) {
    const { data, error } = await authService.emailVerification(
      new Job({
        action: 'emailVerification',
        body: {
          token: req.params.token,
          otp: req.query.otp,
        },
      }),
    );

    if (error) {
      return ErrorResponse(res, {
        error,
        message: `${error}` || 'Failed to verify',
      });
    }
    return Result(res, {
      data: { verificationRes: data },
      message: 'User Verified',
    });
  }

  /* 
    ACTION: Create user
    Credentials: Username, password
    */
  async logout(req: Request, res: Response) {
    res.clearCookie('access_token');
    res.redirect('/');
    return Result(res, {
      message: 'Log Out',
    });
  }
}
