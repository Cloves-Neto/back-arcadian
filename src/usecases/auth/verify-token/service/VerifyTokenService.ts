export interface VerifyTokenService {
  execute(token: string): Promise<any>;
}
