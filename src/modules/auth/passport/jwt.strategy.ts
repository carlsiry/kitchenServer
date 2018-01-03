
import { AuthService } from '../auth.service';
import * as passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Component } from '@nestjs/common';

@Component()
export class JwtStrategy extends Strategy {
    constructor(private readonly authService: AuthService) {
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                passReqToCallback: true,
                secretOrKey: 'secret',
            },
            async (req, payload, next) => await this.verify(req, payload, next)
        );
        passport.use(this);
    }

    public async verify(req, payload, done) {
        console.log('payload is -->', payload)
        const isValid = await this.authService.validateUser(payload);
        if (!isValid) {
            return done('Unauthorized', false);
        }
        done(null, payload);
    }
}
