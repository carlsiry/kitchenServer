/**
 * 2018.01.04-陈坎生 增加微信登录接口路由 onLogin(@Query('code') code) {}
 * 
 */
import { Auth } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Controller, Get, HttpCode, HttpStatus, Post, Body, Param, Req, Query } from '@nestjs/common';
import axios from 'axios';
import { config } from '../../config/config.provider';

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
     * 换取的登录信息包括用户的唯一标识（openid） 及本次登录的 会话密钥（session_key）等。
     * 用户数据的加解密通讯需要依赖会话密钥完成
     * 注：调用 login 会引起登录态的刷新，之前的 sessionKey 可能会失效。
     * @param code 登录凭证
     * 服务器调用此接口 https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
     */
    @Get('onLogin')
    public async onLogin(@Query('code') code) {

        console.log(code);

        const queryString = `appid=${config.appId}&secret=${config.appSecret}&js_code=${code}&grant_type=authorization_code`;
        const wxAPI = `https://api.weixin.qq.com/sns/jscode2session?${queryString}`;

        axios.get(wxAPI)
             .then(response =>{
               console.log(response.data);
               this.authService
            //   User.findOne({openId: response.data.openid}, (err, user) => {
            //     if(user) {
            //       return res.json({
            //         token: generateToken({openid: response.data.openid})
            //       })
            //     } else {
            //       const user = new User();
            //       user.openId = response.data.openid;
            //       user.save();
      
            //       return res.json({
            //         token: generateToken({openid: response.data.openid})
            //       })
            //     }
            //   })
             })
             .catch(error => {
               console.log(error)
             })

        // axios.get('http://localhost:3002/users')
        //     .then((response) => {
        //         console.log(response);
        //     });
        return 'test wxlogin router';
    }

}
