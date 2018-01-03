
import { Auth } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Controller, Get, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';


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
}
