import { UserRepository } from '../UserRepository';
import { User } from '../../models/database/User';
import { UserSequelize } from '../../models/database/SequelizeUser';
import { ProfileSequelize } from '../../models/database/SequelizeProfile';

export class SequelizeUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await UserSequelize.findOne({ 
      where: { email },
      include: [{ model: ProfileSequelize, as: 'profile' }]
    });
    return user ? (user.toJSON() as User) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await UserSequelize.findAll({
      include: [{ model: ProfileSequelize, as: 'profile' }],
      order: [['created_at', 'DESC']]
    });
    return users.map(u => u.toJSON() as User);
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserSequelize.findByPk(id, {
      include: [{ model: ProfileSequelize, as: 'profile' }]
    });
    return user ? (user.toJSON() as User) : null;
  }

  async findByInvitationToken(token: string): Promise<User | null> {
    const user = await UserSequelize.findOne({
      where: { invitation_token: token },
      include: [{ model: ProfileSequelize, as: 'profile' }]
    });
    return user ? (user.toJSON() as User) : null;
  }

  async create(user: Partial<User>): Promise<User> {
    // Note: This expects user.id to be provided if it's external, or it will generate one
    const newUser = await UserSequelize.create(user as any);
    
    // We also need to create a profile for the user if it's missing
    // In the old Supabase flow, this was done via RPC or trigger.
    // In Sequelize, we do it explicitly or via hooks.
    await ProfileSequelize.create({
      user_id: newUser.id,
      full_name: (user as any).full_name || ''
    });

    return newUser.toJSON() as User;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await UserSequelize.findByPk(id);
    if (!user) throw new Error('User not found');
    
    await user.update(data);
    return user.toJSON() as User;
  }
}
