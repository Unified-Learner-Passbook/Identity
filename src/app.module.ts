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

@Module({
  imports: [
    DidModule,
    KycModule,
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, DidController],
  providers: [AppService, PrismaService, DidService],
})
export class AppModule {}
