
import { DbService } from '../../database/db.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './passport/jwt.strategy';
import { AuthService } from './auth.service';
import * as passport from 'passport';
import {
    Module,
    NestModule,
    MiddlewaresConsumer,
    RequestMethod} from '@nestjs/common';

@Module({
  components: [
      AuthService,
      JwtStrategy,
      DbService
  ],
  controllers: [ AuthController ]
})

export class AuthModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void | MiddlewaresConsumer {
        consumer
            .apply(passport.authenticate('jwt', { session: false }))
            .forRoutes({ path: '/auth/authorized', method: RequestMethod.ALL})
    }
}
