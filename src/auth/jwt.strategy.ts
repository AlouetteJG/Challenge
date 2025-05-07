import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el token del header
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'SECRET', // Usa tu secreto aquí
    });
    }

    async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
    }
}
