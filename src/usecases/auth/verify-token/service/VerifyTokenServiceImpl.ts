import { VerifyTokenService } from './VerifyTokenService';
import { SequelizeUserRepository } from '../../../../repositories/database/SequelizeUserRepository';

export class VerifyTokenServiceImpl implements VerifyTokenService {
  private repository: SequelizeUserRepository;

  constructor() {
    this.repository = new SequelizeUserRepository();
  }

  async execute(token: string) {
    const user = await this.repository.findByInvitationToken(token);

    if (!user) {
      throw new Error('Token inválido ou não encontrado.');
    }

    const now = new Date();
    const expiresAt = new Date(user.token_expires_at!);

    if (now > expiresAt) {
      throw new Error('Este convite expirou.');
    }

    let parsedPrivileges = user.privileges;
    if (typeof user.privileges === 'string') {
      try { 
        parsedPrivileges = JSON.parse(user.privileges); 
      } catch { 
        parsedPrivileges = []; 
      }
    }

    return { 
      ...user,
      privileges: Array.isArray(parsedPrivileges) ? parsedPrivileges : []
    };
  }
}
