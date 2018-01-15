
/**
 * 2018.01.13 创建订单模块
 */

import { DbService } from '../../database/db.service';
import { Controller, Get, Inject, Query, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import * as uuid from 'uuid';
import { formatDate, formatCreatedTime } from '../../utils/date.util';

@Controller('order')
export class OrderController {

    constructor (
        private readonly dbService: DbService
    ) {}

    /**
     * 获取餐桌所属区域的名称、桌名信息
     * @param channelId 商家代号
     * @param tableNum 桌号
     * @return [{areaName, tableName}]
     */
    @Get('tabInfo')
    async getTabInfo (@Query('channelId') channelId, @Query('tableNum') tableNum) {
        let queryStr = `
            SELECT 
                Table.tableName,
                Area.areaName 
            FROM 
                kitchendb AS Table
            JOIN 
                kitchendb AS Area ON KEYS Table.areaId
            WHERE
                Table.className == 'TableC'
                and Table.channelId == '${channelId}'
                and Table.tableNum == '${tableNum}';
        `;
        return await this.dbService.query(queryStr);
    }

    /**
     * 获取客户订单序列号
     * @param channelId 商家ID
     * @return {date, num}
     */
    async getSerialNum (channelId: string) {
        let queryStr = `
            SELECT
                date, num
            FROM
                kitchendb 
            WHERE 
                className='OrderNum'
                and channelId = '${channelId}'
        `;
        let result = await this.dbService.query(queryStr);
        // 如果存在订单序列号记录
        if (result.length) {
            const serialDate = new Date(result[0].date).toLocaleDateString();
            const today = new Date().toLocaleDateString();
            // 如果是同一天，序列号递增
            if (serialDate == today) {
                console.log(result);
                let newOrderNum = { date: formatDate(new Date(serialDate)), num: result[0].num };
                return { date: formatDate(new Date(serialDate)), num: result[0].num };
            } else {
                // 新的一天，还没有生成新的订单序列号记录
                return { date: formatDate(new Date()), num : 1 };
            }
        } else {
            // 如果不存在订单序列号记录
            return { date: formatDate(new Date()), num: 1};
        }
    }

    /**
     * 获取该客户下单次数
     * @param channelId 
     * @param tableNo 
     */
    async getOrderDetail (channelId: string, tableNum: string ) {
        let queryStr = `
            SELECT orderNum , serialNum
            FROM kitchendb 
            WHERE 
                className='OrderC'
                and channelId = '${channelId}'
                and tableNum = '${tableNum}'
                and orderState = 1
            ORDER BY createdTime desc
        `;
        let result = await this.dbService.query(queryStr);
        let serailInfo = await this.getSerialNum(channelId);
        if (result.length === 0) {
            return {
                orderNum: 1,
                serialNum: serailInfo.num + 1,
                orderDate: serailInfo.date
            }; 
        } else {
            return {
                orderNum: result[0].orderNum + 1,
                serialNum: serailInfo.num,
                orderDate: serailInfo.date
            };
        }
    }

    /**
     * 单元测试接口
     */
    @Get()
    async test() {
        // console.log(await this.getOrderDetail('gysz', '007'));
        // className='OrderNum' and channelId = 'gysz'
        // console.log(this.getSerialNum('gysz'));
    }

    /**
     * 提交订单
     * @param order: object
     * @return
     */
    @Post()
    @HttpCode(HttpStatus.OK)
    async submitOrder(@Body("order") order) {
        const result = await this.getOrderDetail(order.channelId, order.tableNum);
        console.log('查看序列号和份数', result);
        const newOrderNum = result.orderNum; // 餐桌下单数量
        const newSerialNum = result.serialNum;
        const newOrderDate = result.orderDate;
        order.allPrice = Number(order.allPrice);
        order.orderNum = newOrderNum;
        order.orderState = 1;
        if (newSerialNum < 10) {
            order.serialNum = '00' + newSerialNum;
        } else if (newSerialNum < 100) {
            order.serialNum = '0' + newSerialNum;
        } else {
            order.serialNum = '' + newSerialNum;
        }
        order.createdTime = formatCreatedTime(new Date());
        this.dbService.upsert('OrderC.' + uuid.v4(), order)
            .then((res) => {
                console.log(res);
                const OrderCNum = {
                    className: 'OrderNum',
                    channelId: order.channelId,
                    date: newOrderDate,
                    num: newSerialNum
                };
                this.dbService.upsert('OrderNum.e40acf36-045d-4e21-ae9c-28365e04a422', OrderCNum)
                .then(r => console.log(r))
                .catch(r => console.log(r));
            })
            .catch(err => console.log(err));
    }
}

// #region reference 以下为安卓端实现代码 -- BY  孙工
/*
if (orderCList.size() > 0) {
    newOrderObj.setOrderNum(orderCList.get(0).getOrderNum() + 1);
    newOrderObj.setSerialNum(orderCList.get(0).getSerialNum());
} else {
    newOrderObj.setOrderNum(1);
    newOrderObj.setSerialNum(getOrderSerialNum());
}

 private String getOrderSerialNum() {
        String orderNum = null;
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

        List<OrderNum> orderNumList = CDBHelper.getObjByWhere(getApplicationContext(), Expression.property("className").equalTo("OrderNum")
                , null
                , OrderNum.class);
        if (orderNumList.size() <= 0)//第一次使用
        {
            OrderNum obj = new OrderNum(myApp.getCompany_ID());
            String time = formatter.format(new Date());
            obj.setDate(time);
            obj.setNum(1);
            CDBHelper.createAndUpdate(getApplicationContext(), obj);
            orderNum = "001";
        } else//有数据，判断是不是当天
        {
            OrderNum obj = orderNumList.get(0);
            String olderDate = obj.getDate();
            String newDate = formatter.format(new Date());
            int num = obj.getNum();
            if (!newDate.equals(olderDate))//不是一天的，
            {
                obj.setNum(1);
                obj.setDate(newDate);
                CDBHelper.createAndUpdate(getApplicationContext(), obj);
                orderNum = "001";
            } else//同一天
            {
                int newNum = num + 1;
                obj.setNum(newNum);
                CDBHelper.createAndUpdate(getApplicationContext(), obj);
                orderNum = String.format("%3d", newNum).replace(" ", "0");
            }
        }

        return orderNum;

    }
*/
// #endregion
