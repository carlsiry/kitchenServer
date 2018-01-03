
import { DbService } from '../../database/db.service';
import { Module } from '@nestjs/common';
import { ChannelController } from '../channel/channel.controller'

@Module({
    controllers: [ ChannelController ],
    components: [ DbService ]
})
export class ChannelModule { }
