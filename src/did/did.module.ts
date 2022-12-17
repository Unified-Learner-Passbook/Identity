import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { DidController } from './did.controller';
import { DidService } from './did.service';

@Module({
  imports: [HttpModule],
  controllers: [DidController],
  providers: [DidService, PrismaService],
})
export class DidModule {}
