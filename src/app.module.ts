import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ScriptModule } from './script/script.module';
import { VoiceService } from './voice/voice.service';
import { VoiceModule } from './voice/voice.module';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { VoiceController } from './voice/voice.controller';
import { ScriptController } from './script/script.controller';
import { UserService } from './user/user.service';
import { ScriptService } from './script/script.service';

@Module({
  imports: [PrismaModule, ScriptModule, VoiceModule, UserModule],
  controllers: [AppController, UserController, VoiceController, ScriptController],
  providers: [AppService, UserService, VoiceService, ScriptService],
})
export class AppModule {}
