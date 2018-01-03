
/**
 *
 */

import { DbService } from '../../database/db.service';
import { DishesController } from './dishes.controller';
import { Module } from '@nestjs/common';

@Module({
    controllers: [ DishesController ],
    components: [ DbService ]
})
export class DishesModule {}
