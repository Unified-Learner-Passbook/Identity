import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { VcController } from './vc.controller';
import VcService from './vc.service';

@Module({
  imports: [HttpModule],
  controllers: [VcController],
  providers: [VcService, PrismaService],
})
export class VcModule {}
