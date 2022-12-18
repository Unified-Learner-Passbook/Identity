import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DidModule } from 'src/did/did.module';
import { DidService } from 'src/did/did.service';
import { PrismaService } from 'src/prisma.service';
import { VcController } from './vc.controller';
import VcService from './vc.service';

@Module({
  imports: [HttpModule],
  controllers: [VcController],
  providers: [VcService, PrismaService, DidService],
})
export class VcModule {}
