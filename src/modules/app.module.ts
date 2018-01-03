
import { DishesModule } from './dishes/dishes.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DbService } from '../database/db.service';
import { ChannelModule } from './channel/channel.module';


@Module({
  modules: [ AuthModule, DishesModule, ChannelModule ],
  controllers: [ AppController ],
  components: [ ],
})
export class ApplicationModule { }
