import { Module } from '@nestjs/common';
import { VoiceController } from './voice.controller';
import { VoiceService } from './voice.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers : [VoiceController],
  providers   :   [VoiceService, PrismaService]
})

export class VoiceModule {}