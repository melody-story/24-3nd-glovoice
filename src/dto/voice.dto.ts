import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class VoiceDTO {
    @IsOptional()
    @IsNumber()
    fileSize	

    @IsUrl()
    @IsString()
    url	          
}