import type LoginService from './LoginService';
import type { LoginResponse } from './LoginService';
import { SequelizeUserRepository } from '../../../../repositories/database/SequelizeUserRepository';
import PasswordHasher from '../../../../utils/bcrypt';
import JwtTokenManager from '../../../../utils/jwt';
import { logger } from '../../../../utils/logger';

export default class LoginServiceImpl implements LoginService {
  private repository: SequelizeUserRepository;

  public constructor() {
    this.repository = new SequelizeUserRepository();
  }

  public async authenticate(email: string, password: string): Promise<LoginResponse | null> {
    const user = await this.repository.findByEmail(email.toLowerCase());

    if (!user || !user.password) {
      logger.warn(`Tentativa de login falha: Usuário não encontrado ou sem senha [Email: ${email.toLowerCase()}]`);
      return null;
    }

    const isPasswordValid = await PasswordHasher.compare(password, user.password);

    if (!isPasswordValid) {
      logger.warn(`Tentativa de login falha: Senha incorreta [Email: ${email.toLowerCase()}]`);
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    
    const token = JwtTokenManager.generate({ 
      id: user.id, 
      email: user.email,
      role: user.role,
      must_change_password: user.must_change_password,
      profile_id: user.profile?.id
    });

    logger.info(`Usuário autenticado com sucesso [ID: ${user.id}, Role: ${user.role}]`);

    return {
      user: userWithoutPassword,
      token
    };
  }
}
