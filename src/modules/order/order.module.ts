
import { DbService } from '../../database/db.service';
import { OrderController } from './order.controller';
import { Module } from '@nestjs/common';

@Module({
    controllers: [ OrderController ],
    components: [ DbService ]
})
export class OrderModule { }
