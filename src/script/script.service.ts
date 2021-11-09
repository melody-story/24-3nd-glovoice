import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScriptService {
    constructor (private prisma: PrismaService) {}
        
    async getOneSentence (user_id:number):Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: {
                id : user_id,
            },
            select: {
                languages : true,
                gender    : true,
                birthday  : true,
            },
        });
        
        if (!user) {
                throw await new HttpException({ MESSAGE: 'USER DOES NOT EXIST' }, 400);;
        }
        
        const user_language = user['languages'];
        const user_gender   = user['gender'];
        let sentences       = []
        
        sentences = await this.prisma.sentence.findMany({
            where: {
                AND: [
                    {language : user_language},
                    {gender   : user_gender},
                ]
            },
            select: {
                id       : true,
                scriptId : true,
                context  : true,
                language : true,
                age      : true,
                gender   : true
            },
            orderBy: {
                id: "asc"
            },
        });
        
        const sentence_index = Math.floor(Math.random() * sentences.length)
        
        return sentences[sentence_index];
    };

    
}
