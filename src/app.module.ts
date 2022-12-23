import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { DidService } from './did/did.service';
import { DidController } from './did/did.controller';
import { DidModule } from './did/did.module';
import { HttpModule } from '@nestjs/axios';
import { KycModule } from './kyc/kyc.module';
import { ConfigModule } from '@nestjs/config';
import { VcModule } from './vc/vc.module';
import { EmailController } from './mailer/email.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from './mailer/email.module';
import { EmailService } from './mailer/email.service';

@Module({
  imports: [
    DidModule,
    KycModule,
    VcModule,
    EmailModule,
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_SENDER,
          pass: process.env.EMAIL_PASSWORD
        }
      }
    })
  ],
  controllers: [AppController, DidController, EmailController],
  providers: [AppService, PrismaService, DidService, EmailService],
})
export class AppModule {}
