import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { KycController } from './kyc.controller';
import KycService from './kyc.service';

@Module({
  imports: [HttpModule],
  controllers: [KycController],
  providers: [KycService, PrismaService],
})
export class KycModule {}
