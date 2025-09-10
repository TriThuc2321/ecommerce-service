import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { ICatchError, ISendEmail } from '@/types';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail({ subject, to, template, context }: ISendEmail) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template: `${__dirname}/templates/${template}`,
        context: context as Record<string, string>,
      });
    } catch (error) {
      const { message } = error as ICatchError;

      throw new HttpException(
        `Error sending email: ${message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
