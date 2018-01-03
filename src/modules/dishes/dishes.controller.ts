
/**
 *
 */

import { DbService } from '../../database/db.service';
import { Controller, Get, Inject } from '@nestjs/common';


@Controller('dishes')
export class DishesController {

    constructor(
        private readonly dbService: DbService) {}

    @Get()
    async getById() {
        return await this.dbService.getById('Person|22637716-66f9-4164-ac4a-bef1b9963225');
    }

}
