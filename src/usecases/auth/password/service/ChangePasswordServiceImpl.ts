import ChangePasswordService from './ChangePasswordService';
import { SequelizeUserRepository } from '../../../../repositories/database/SequelizeUserRepository';
import PasswordHasher from '../../../../utils/bcrypt';

export default class ChangePasswordServiceImpl implements ChangePasswordService {
  private repository: SequelizeUserRepository;

  constructor() {
    this.repository = new SequelizeUserRepository();
  }

  async execute(newPassword: string, userId?: string, token?: string): Promise<string> {
    const hashedPassword = await PasswordHasher.hash(newPassword);
    let targetUserId = userId;

    if (token) {
      const user = await this.repository.findByInvitationToken(token);
      if (!user) throw new Error('Token inválido ou expirado.');
      targetUserId = user.id;
    }

    if (!targetUserId) throw new Error('Usuário não identificado.');

    const user = await this.repository.findById(targetUserId);
    if (!user) throw new Error('Usuário não encontrado.');

    // Limit check only when user changes password via profile page (not via activation token)
    if (!token && user.settings?.password_last_changed) {
      const lastChanged = new Date(user.settings.password_last_changed);
      const diffMs = new Date().getTime() - lastChanged.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      if (diffHours < 2) {
        const remainingMs = 2 * 60 * 60 * 1000 - diffMs;
        const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));
        throw new Error(`A senha só pode ser alterada uma vez a cada 2 horas. Restam ${remainingMinutes} minutos.`);
      }
    }

    const currentSettings = user.settings || {};
    const updatedUser = await this.repository.update(targetUserId, {
      password: hashedPassword,
      must_change_password: false,
      invitation_token: 'used',
      token_expires_at: '1970-01-01T00:00:00+00:00',
      settings: {
        ...currentSettings,
        password_last_changed: new Date().toISOString()
      }
    });

    return updatedUser.email;
  }
}
