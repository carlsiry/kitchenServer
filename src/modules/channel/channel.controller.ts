
import { DbService } from '../../database/db.service';
import { Body, Controller, Get, Inject } from '@nestjs/common';
import { Channel } from './channel.dto';
import { bucket } from '../../database/db.service'


@Controller('channel')
export class ChannelController {

    constructor(
        private readonly dbService: DbService
    ) { }

    @Get()
    async getById(@Body() channel: Channel) {
        console.log(channel)
        const sqlStr = `select META().id,channelId,pointName, pointAdress
          from ${ bucket._name }
          where className="CompanyC" and channelId="${channel.channelId}"`;
        return await this.dbService.query(sqlStr);
    }
}
