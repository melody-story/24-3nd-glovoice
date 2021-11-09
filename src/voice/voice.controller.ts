import { Controller, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VoiceService } from './voice.service';

@Controller('voice')
export class VoiceController {

    constructor( private readonly voiceService: VoiceService ) {}

    @Post('upload') 
    @UseInterceptors(FileInterceptor('voice_file'))
    async UploadVoice(@Query('sentence_id') sentence_id :number,@Query('user_id') user_id:number,@UploadedFile() file):Promise<any>{
        return await this.voiceService.UploadVoice(sentence_id, user_id, file);
    }
}