/**
 * 2018.01.04-陈坎生 增加微信登录接口路由 onLogin(@Query('code') code) {}
 * 
 */
import { Auth } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Controller, Get, HttpCode, HttpStatus, Post, Body, Param, Req, Query } from '@nestjs/common';


@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('token')
    @HttpCode(HttpStatus.OK)
    public async getToken(@Body() auth: Auth) {
        return await this.authService.createToken(auth);
    }

    @Get('authorized')
    public async authorized() {
        console.log('Authorized route...');
    }

    /**
     * 小程序客户端调用此接口 换取用户登录状态信息。 -- 2018.01.04 陈坎生
     * 包括用户的唯一标识（openid） 及本次登录的 会话密钥（session_key）等。
     * 用户数据的加解密通讯需要依赖会话密钥完成。
     * 注：调用 login 会引起登录态的刷新，之前的 sessionKey 可能会失效。
     * @param code 登录凭证
     * 服务器调用此接口 https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
     */
    @Get('onLogin')
    public async onLogin(@Query('code') code) {
        console.log(code);
        return 'test wxlogin router';
    }

}
