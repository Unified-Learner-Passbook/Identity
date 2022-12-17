import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { DidService } from './did/did.service';
import { DidController } from './did/did.controller';
import { DidModule } from './did/did.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DidModule, HttpModule],
  controllers: [AppController, DidController],
  providers: [AppService, PrismaService, DidService],
})
export class AppModule {}
