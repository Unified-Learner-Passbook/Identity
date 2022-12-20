import { MailerService } from '@nestjs-modules/mailer';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('email')
export class EmailController {
    constructor(private mailService:MailerService) {}

    @Post('sendMail')
    async sendPlainTextMail(@Body() body: any) {
        const response = await this.mailService.sendMail({
            to: body.toMail,
            from: 'mock.aadhar@gmail.com',
            subject: body.subject,
            text: body.content
        })

        return response;
    }
}
