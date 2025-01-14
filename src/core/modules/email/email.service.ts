import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';
import { Job, JobResponse } from '@src/core/utils/job';
import logger from '@src/utils/logger';

dotenv.config();

export class EmailService {
  private readonly transporter: Transporter;

  constructor() {
    // Initialize transporter once during service instantiation
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: process.env.EMAIL_SERVICE,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    // Verify transporter connection on service initialization
    this.transporter.verify((error) => {
      if (error) {
        logger.error('Failed to initialize email transporter:', error);
      } else {
        logger.info('Email transporter initialized successfully.');
      }
    });
  }

  /**
   * Send a single email.
   * @param job - Job containing email data
   * @returns Result of email sending
   */
  async sendEmail(job: Job): Promise<JobResponse> {
    const { body: mailData } = job;

    if (!mailData?.toEmail || !mailData?.subject || !mailData?.htmlBody) {
      return {
        error: 'Missing required email fields',
        message: 'Failed to send email',
      };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: mailData.toEmail,
      subject: mailData.subject,
      html: mailData.htmlBody,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return { data: info, message: 'Email sent successfully' };
    } catch (error) {
      logger.error('Error sending email:', error);
      return { error, message: 'Failed to send email' };
    }
  }

  /**
   * Send bulk emails.
   * @param job - Job containing array of email data
   * @returns Result of bulk email sending
   */
  async sendBulkEmail(
    job: Job,
  ): Promise<{ data?: any; error?: any; message: string }> {
    const { body: bulkMailData } = job;

    if (!Array.isArray(bulkMailData) || bulkMailData.length === 0) {
      return {
        error: 'No email data provided',
        message: 'Failed to send bulk emails',
      };
    }

    try {
      const results = await Promise.all(
        bulkMailData.map(async (mailData: any) => {
          const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: mailData.toEmail,
            subject: mailData.subject,
            html: mailData.htmlBody,
          };

          return this.transporter.sendMail(mailOptions);
        }),
      );

      return { data: results, message: 'Bulk emails sent successfully' };
    } catch (error) {
      logger.error('Error sending bulk emails:', error);
      return { error, message: 'Failed to send bulk emails' };
    }
  }
}
