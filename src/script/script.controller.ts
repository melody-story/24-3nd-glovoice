import { Controller, Get, Query } from '@nestjs/common';
import { ScriptService } from './script.service';

@Controller('script')
export class ScriptController {

    constructor(private readonly scriptService: ScriptService) {}

    @Get("sentence")
    getOneSentence(@Query('userId') userId: number): any {
        return this.scriptService.getOneSentence(userId);
    }
}
