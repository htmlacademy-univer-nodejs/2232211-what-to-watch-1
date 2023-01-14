import * as crypto from 'crypto';
import * as jose from 'jose';

export const createSHA256 = (line: string, salt: string): string => crypto
  .createHmac('sha256', salt)
  .update(line)
  .digest('hex');

export const createJWT = async (algorithm: string, jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({...payload})
    .setProtectedHeader({ alg: algorithm})
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));
