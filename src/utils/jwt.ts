import jwt from 'jsonwebtoken';
import { CONFIG } from './config';

export default class JwtTokenManager {
  public static generate(payload: any): string {
    return jwt.sign(payload, CONFIG.JWT_SECRET as string, {
      expiresIn: CONFIG.JWT_EXPIRES_IN as any,
    });
  }

  public static verify(token: string): any {
    try {
      return jwt.verify(token, CONFIG.JWT_SECRET as string);
    } catch (error) {
      return null;
    }
  }
}
