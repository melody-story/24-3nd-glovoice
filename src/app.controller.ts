import { Controller }    from '@nestjs/common';
import { AppService }    from './app.service';
import { ScriptService } from './script/script.service';
import { UserService }   from './user/user.service';
import { VoiceService }  from './voice/voice.service';

@Controller('')
export class AppController {
  constructor(
    private readonly appService    : AppService,
    private readonly userService   : UserService,
    private readonly voiceService  : VoiceService,
    private readonly scriptService : ScriptService,
  ) {}
}
