
import { DishesModule } from './dishes/dishes.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DbService } from '../database/db.service';
import { ChannelModule } from './channel/channel.module';


@Module({
  modules: [ AuthModule, DishesModule, ChannelModule, OrderModule ],
  controllers: [ AppController ],
  components: [ ],
})
export class ApplicationModule { }
