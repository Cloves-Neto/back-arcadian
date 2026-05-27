import { User } from '../../../../models/database/User';
import { UserService } from './UserService';
import { SequelizeUserRepository } from '../../../../repositories/database/SequelizeUserRepository';
import { SequelizeProfileRepository } from '../../../../repositories/database/SequelizeProfileRepository';
import { SequelizeClientRepository } from '../../../../repositories/database/SequelizeClientRepository';
import { ProfileRepository } from '../../../../repositories/ProfileRepository';
import { ClientRepository } from '../../../../repositories/ClientRepository';
import PasswordHasher from '../../../../utils/bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { LogServiceImpl } from '../../logs/service/LogServiceImpl';
import { EmailService } from '../../../../utils/EmailService';
import crypto from 'crypto';

export class UserServiceImpl implements UserService {
  private userRepository: SequelizeUserRepository;
  private profileRepository: ProfileRepository;
  private clientRepository: ClientRepository;

  constructor() {
    this.userRepository = new SequelizeUserRepository();
    this.profileRepository = new SequelizeProfileRepository();
    this.clientRepository = new SequelizeClientRepository();
  }

  async create(data: any): Promise<User> {
    const emailNormalized = data.email.trim().toLowerCase();
    
    if (!emailNormalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalized)) {
      throw new Error('Formato de e-mail inválido.');
    }

    if (!data.full_name || data.full_name.trim().length < 3) {
      throw new Error('O nome deve ter no mínimo 3 caracteres.');
    }

    let cleanDdd = '';
    let cleanPhone = '';

    if (data.role === 'admin') {
      if (!data.ddd || data.ddd.replace(/\D/g, '').length !== 2) {
        throw new Error('O DDD deve conter exatamente 2 dígitos.');
      }
      if (!data.phone || ![8, 9].includes(data.phone.replace(/\D/g, '').length)) {
        throw new Error('O telefone deve conter entre 8 e 9 dígitos.');
      }
      cleanDdd = data.ddd.replace(/\D/g, '');
      cleanPhone = data.phone.replace(/\D/g, '');

      if (!data.privileges || data.privileges.length === 0) {
        throw new Error('Selecione pelo menos um privilégio para o administrador.');
      }
    } else if (data.role === 'client' && data.client_data) {
      const clientDdd = data.client_data.phone_ddd || data.ddd || '';
      const clientPhone = data.client_data.phone || data.phone || '';

      if (!clientDdd || clientDdd.replace(/\D/g, '').length !== 2) {
        throw new Error('O DDD deve conter exatamente 2 dígitos.');
      }
      if (!clientPhone || ![8, 9].includes(clientPhone.replace(/\D/g, '').length)) {
        throw new Error('O telefone deve conter entre 8 e 9 dígitos.');
      }
      cleanDdd = clientDdd.replace(/\D/g, '');
      cleanPhone = clientPhone.replace(/\D/g, '');

      if (!data.client_data.tax_id) {
        throw new Error('CNPJ ou CPF é obrigatório.');
      }
    }

    const existingUser = await this.userRepository.findByEmail(emailNormalized);
    if (existingUser) {
      throw new Error('Usuário já existe com este email.');
    }

    const invitationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const tempPass = crypto.randomBytes(16).toString('hex');
    const hashedPassword = await PasswordHasher.hash(tempPass);

    const newUser = await this.userRepository.create({
      id: uuidv4(),
      email: emailNormalized,
      full_name: data.full_name,
      password: hashedPassword,
      role: data.role,
      must_change_password: true,
      is_admin_created: true,
      invitation_token: invitationToken,
      token_expires_at: tokenExpiresAt as any,
      privileges: data.privileges || []
    });

    const profile = await this.profileRepository.findByUserId(newUser.id);
    if (profile) {
      const formattedPhone = `(${cleanDdd}) ${cleanPhone}`;
      const updatePayload: any = {
        phone: formattedPhone
      };
      
      if (data.role === 'client' && data.client_data) {
        updatePayload.tax_id = data.client_data.tax_id.replace(/\D/g, '');
        updatePayload.cep = data.client_data.cep.replace(/\D/g, '');
        updatePayload.street = data.client_data.street;
        updatePayload.number = data.client_data.number;
        updatePayload.complement = data.client_data.complement;
        updatePayload.neighborhood = data.client_data.neighborhood;
        updatePayload.city = data.client_data.city;
      }

      await this.profileRepository.upsert(newUser.id, updatePayload);

      if (data.role === 'client' && data.client_data) {
        await this.clientRepository.create({
          profile_id: profile.id,
          company_name: data.client_data.company_name,
          company_category: data.client_data.category
        });
      }
    }

    await EmailService.sendInvitation(data.email, data.full_name, invitationToken);

    const logService = new LogServiceImpl();
    await logService.record({
      action: 'USER_CREATED_BY_ADMIN',
      details: `Novo usuário criado e convite enviado: ${data.email} (${data.role})`
    });

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword as User;
  }

  async update(userId: string, data: { full_name?: string, role?: string, privileges?: string[] }): Promise<User> {
    if (data.role || data.privileges) {
      const userUpdate: any = {};
      if (data.role) userUpdate.role = data.role;
      if (data.privileges) userUpdate.privileges = data.privileges;

      await this.userRepository.update(userId, userUpdate);
    }

    if (data.full_name) {
      const profile = await this.profileRepository.findByUserId(userId);
      if (profile) {
        await this.profileRepository.upsert(userId, { full_name: data.full_name });
      }
    }

    const updatedUser = await this.userRepository.findById(userId);
    if (!updatedUser) throw new Error('Usuário não encontrado após atualização');
    
    return updatedUser;
  }

  async delete(userId: string): Promise<boolean> {
    // userRepository.delete is not implemented yet in interface, leaving placeholder
    // await this.userRepository.delete(userId);
    return true;
  }

  async list(): Promise<User[]> {
    const users = await this.userRepository.findAll();
    return users.map(({ password, ...user }) => user as User);
  }

  async find(userId: string): Promise<User | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  async updateSettings(userId: string, settings: any): Promise<User> {
    await this.userRepository.update(userId, { settings });
    const updatedUser = await this.userRepository.findById(userId);
    if (!updatedUser) throw new Error('Usuário não encontrado após atualizar configurações');
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  }
}
