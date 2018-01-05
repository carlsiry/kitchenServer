
/**
 * 2018.01.05 增加扫码商家二维码参数获取菜单接口路由
 */

import { DbService } from '../../database/db.service';
import { Controller, Get, Inject, Query } from '@nestjs/common';


@Controller('dishes')
export class DishesController {

    constructor(
        private readonly dbService: DbService) {}

    // @Get()
    // async getById() {
    //     return await this.dbService.getById('DishesC.2b4bcd45-f371-4202-91b9-fda13f7c085a');
    // }

    /**
     * 根据商家ID来获取店内菜单
     */
    @Get()
    async getByChannelId(@Query('channelId') channelId) {
        console.log(channelId);
        return await this.dbService.query(`
            SELECT DishesKindC.kindName, meta(DishesKindC).id,
                ARRAY {
                    META(c).id,
                    "dishesName": c.dishesName,
                    "imgUrl": 'http://gysz:123456@123.207.174.171:4984/kitchendb/'||META(c).id||'/blob_1',
                    "price": c.price
                } 
                FOR c IN DeshesC END AS dishesList
            FROM kitchendb AS DishesKindC NEST kitchendb AS DeshesC ON KEYS DishesKindC.dishesListId
                WHERE DishesKindC.className = "DishesKindC" and DishesKindC.channelId="${channelId}"
        `);
    }
}
