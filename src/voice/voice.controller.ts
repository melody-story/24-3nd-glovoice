import { Controller, Param, Post, Query, UploadedFile, UseInterceptors, Get } from '@nestjs/common';
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
      
    @Post(':voice_id/play_count')
    async PlayCountOfVoice(@Param('voice_id') voice_id:number, @Query('user_id') user_id:number): Promise<any>{
        return await this.voiceService.PlayCountOfVoice(voice_id, user_id);
    }

    @Get("verify")
    async GetVerifySentence(@Query('userId') userId: number): Promise<any> {
        return await this.voiceService.GetVerifyVoice(userId);
    }

    @Get(':voice_id/verify_status')
    async VerifyStatus(@Param('voice_id') voice_id:number): Promise<any>{
        return await this.voiceService.VerifyStatus(voice_id);
    }

    @Post('verify/:voice_verify_status_id/confirm')
    async ConfirmVoice(@Param('voice_verify_status_id') voice_verify_status_id:number): Promise<any>{
        return await this.voiceService.ConfirmVoice(voice_verify_status_id);
    }
}