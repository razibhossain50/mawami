import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthPayload } from '../interfaces/auth-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your-secret-key'
    });
    console.log('JWT Strategy initialized with secret:', 'your-secret-key');
  }

  validate(payload: AuthPayload) {
    console.log('=== JWT VALIDATION ===');
    console.log('JWT Strategy - validating payload:', payload);
    console.log('JWT Strategy - payload type:', typeof payload);
    console.log('JWT Strategy - payload keys:', Object.keys(payload));
    const user = { id: payload.id, email: payload.email, role: payload.role };
    console.log('JWT Strategy - returning user:', user);
    return user;
  }
}
