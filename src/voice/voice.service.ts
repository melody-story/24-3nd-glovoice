import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VoiceDTO } from '../dto/voice.dto';

import * as AWS from 'aws-sdk';

@Injectable()
export class VoiceService {

    constructor(private prisma: PrismaService) {}

    async UploadVoice(sentence_id: number, user_id: number, file): Promise<VoiceDTO> {
        const user = await this.prisma.user.findUnique({
            where: {id : user_id}
        })
        const sentence = await this.prisma.sentence.findUnique({
            where: {id : sentence_id}
        })
        const FILE_VOLUME_LIMIT = 5242880;
        
        if (!user) {
            throw await new HttpException({ MESSAGE: 'USER DOES NOT EXIST' }, 404);
        }
        if (!sentence) {
            throw await new HttpException({ MESSAGE: 'SENTENCE DOES NOT EXIST' }, 404);
        }
        if (!file) {
            throw await new HttpException({ MESSAGE: 'PLEASE UPLOAD VOICE FILE ' }, 400);
        }
        if (file.size > FILE_VOLUME_LIMIT) {
            throw await new HttpException({ MESSAGE : 'PLEASE RECORD UNDER 5MB'}, 400);
        }

        const AWS_S3_BUCKET_NAME = 'glovoice-backend'
        const AWS_REGION         = 'ap-northeast-2'
            
        AWS.config.update({
            credentials: {
                accessKeyId     : process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY,
            }
        });

        const objectName = `${Date.now()}_sentenceId_${sentence_id}`;
        
        const upload = new AWS.S3()
        .putObject({
            Key    : objectName,
            Body   : file.buffer,
            Bucket : AWS_S3_BUCKET_NAME,
            ACL    : 'public-read',
        }).promise();
        
        const url = `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${objectName}`
        
        const newVoice = this.prisma.voice.create ({
            data: {
            fileSize : file.size,
            url      : url,
            user     : {connect : {id : user_id}},
            sentence : {connect : {id : sentence_id}}
            }
        });
            return newVoice;
    }

    async PlayCountOfVoice (voice_id:number, user_id: number):Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: {id : user_id}
        })
        if (!user) {
            throw await new HttpException({ MESSAGE: 'USER DOES NOT EXIST' }, 404);
        }
        const voice = await this.prisma.voice.findUnique({
            where: {id : voice_id}
        })
        if (!voice) {
            throw await new HttpException({ MESSAGE: 'VOICE DOES NOT EXIST' }, 404);
        }
        const getvoiceStatus = await this.prisma.voiceVeriftyStatus.findUnique({
            where: {voiceId : voice_id}
        })
        if (getvoiceStatus) {
            throw await new HttpException({ MESSAGE: 'THIS VOICE IS ALREADY VERIFIED' }, 404);;
        }
        
        const voiceStatus = this.prisma.voiceVeriftyStatus.create({
            data:{
            voice : {connect : {id : voice_id}},
            user  : {connect : {id : user_id}},
            },
        })
        return voiceStatus;
    }

    async GetVerifyVoice(user_id:number):Promise<any> {
        const user = await this.prisma.user.findUnique({
          where : {id        : user_id},
          select: {languages : true},
        });
        
        if (!user) {
          throw await new HttpException({ MESSAGE: 'USER DOES NOT EXIST' }, 404);
        }
        
        let voices = []
        voices = await this.prisma.voice.findMany({
          where: {
            NOT: {userId : user_id},
          },
          select: {
            id          : true,
            url         : true,
            sentenceId  : true,
            userId      : true,
          },
          orderBy: {id: "asc"},
        });
        
        const voice_index = Math.floor(Math.random() * voices.length)
        
        if (!voices[voice_index]) {
          throw await new HttpException({ MESSAGE: 'VOICE DOES NOT EXIST' }, 404);
        }
        return voices[voice_index];
      }   
}