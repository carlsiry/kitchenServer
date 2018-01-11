import * as jwt from 'jsonwebtoken';
import { Auth } from './dto/auth.dto';
import { Component } from '@nestjs/common';
import { config } from '../../config/config.provider';
import { DbService } from '../../database/db.service';

@Component()
export class AuthService {

    constructor(private readonly dbService: DbService) { } 

    async createToken(auth: Auth) {
        const expiresIn = 60 * 60;
        const secretOrKey = 'secret';
        const user = { username: auth.username, password: auth.password, channelId: auth.channelId }  ;
        const token = jwt.sign(user, secretOrKey, { expiresIn });
        return {
            expires_in: expiresIn,
            access_token: token,
        };
    }

    async validateUser(signedUser): Promise<boolean> {
        console.log('sign user ->', signedUser)
        const sqlstr = `select META(kuser).id, kuser.userName, kuser.passwd from ${ config.couchbase.bucket } as kuser 
                            where 
                            kuser.className='UsersC' 
                            and kuser.userName = '${signedUser.username}' 
                            and kuser.passwd = '${signedUser.password}' 
                            and channelId = '${signedUser.channelId}'`;
        const user = await this.dbService.query(sqlstr);
        //如果没有查询到用户返回验证失败
        if (!user[0]) {
            console.log('用户名或密码输入错误！');
            return false;
        }
        return true;
    }
    async findUser(openId: string) {
        console.log('find user ->', openId);
        const sqlstr = `select 
            where className
        `
    }
}