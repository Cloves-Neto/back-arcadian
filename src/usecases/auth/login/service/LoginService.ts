import type { User } from '../../../../models/database/User';

export interface LoginResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export default interface LoginService {
  authenticate(email: string, password: string): Promise<LoginResponse | null>;
}
