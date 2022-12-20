import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
    constructor(private readonly emailService: EmailService) { }

    @Post('sendMail')
    sendMail(@Body() body: any) {
        return this.emailService.sendMail(body.mailTo, body.subject, body.content, body.filename, body.filepath)
    }
}
