import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
  imports: [MailerModule],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
