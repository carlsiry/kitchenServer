
/**
 * 2018.01.05 增加扫码商家二维码参数获取菜单接口路由
 */

import { DbService } from '../../database/db.service';
import { Controller, Get, Inject, Query } from '@nestjs/common';


@Controller('dishes')
export class DishesController {

    constructor(
        private readonly dbService: DbService) {}


    /**
     * 根据商家ID来获取店内菜单
     * @param channelId
     * @return {"dishesKindName": string, id: string, "dishesList": []{id, dishesName, imgUrl, price} }
     */
    @Get()
    async getByChannelId(@Query('channelId') channelId) {
        console.log(channelId);
        return await this.dbService.query(`
            SELECT b.id, b.kindName,
                    ARRAY_AGG({
                    "id":b.DeshesC_id,
                    "dishesName":b.dishesName,
                    "imgUrl":b.imgUrl,
                    "price":b.price,
                    "tastes":b.tastes
                    }) AS dishesList
            FROM (
                SELECT a.id,a.kindName, a.DeshesC_id, a.dishesName, a.imgUrl, a.price,
                        ARRAY t.tasteName FOR t IN DishesTasteC END AS tastes
                FROM (
                SELECT DishesKindC.kindName, META(DishesKindC).id,
                        META(DeshesC).id AS DeshesC_id,DeshesC.dishesName,DeshesC.price,DeshesC.tasteList,
                        'http://chen:123456@123.207.174.171:4984/kitchendb/'||META(DeshesC).id||'/blob_1' AS imgUrl
                FROM kitchendb AS DishesKindC JOIN kitchendb AS DeshesC ON KEYS DishesKindC.dishesListId
                    WHERE DishesKindC.className == "DishesKindC" 
                    AND DishesKindC.channelId="gysz"
            ) a NEST kitchendb AS DishesTasteC ON KEYS a.tasteList
            
            UNION ALL
            
            SELECT DishesKindC.kindName, meta(DishesKindC).id, META(DeshesC).id AS DeshesC_id,
                    DeshesC.dishesName,
                    'http://chen:123456@123.207.174.171:4984/kitchendb/'||META(DeshesC).id||'/blob_1' AS imgUrl,
                    DeshesC.price
            FROM kitchendb AS DishesKindC JOIN kitchendb AS DeshesC ON KEYS DishesKindC.dishesListId
                WHERE DishesKindC.className == "DishesKindC" 
                and DishesKindC.channelId="gysz"
                AND (DishesKindC.tasteList IS MISSING OR ARRAY_LENGTH(DishesKindC.tasteList) == 0)    
            ) b GROUP BY b.id,b.kindName
        `);
    }


    // @Get()
    // async getById() {
    //     return await this.dbService.getById('DishesC.2b4bcd45-f371-4202-91b9-fda13f7c085a');
    // }

}


/*
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
*/

