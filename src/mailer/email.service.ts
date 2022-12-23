import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
    constructor(private mailService: MailerService) { }

    async sendMail(
        mailTo: string,
        subject: string,
        content: string,
        filename: string,
        filepath: string
    ) {

        if (!mailTo || !subject || !content) {
            throw new BadRequestException()
        }
        let mailData = {
            to: mailTo,
            from: 'mock.aadhar@gmail.com',
            subject: subject,
            text: content,
        }
        if (filename && filepath) {
            mailData["attachments"] = [
                {
                    filename: filename,
                    path: filepath
                }
            ]
        }
        const response = await this.mailService.sendMail(mailData)

        return response;
    }
}
