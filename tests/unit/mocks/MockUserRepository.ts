import { UserRepository } from '../../../src/repositories/UserRepository';
import { User } from '../../../src/models/database/User';

export class MockUserRepository implements UserRepository {
  private users: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = { id: user.id || 'mock-id', ...user } as User;
    this.users.push(newUser);
    return newUser;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], ...data };
      return this.users[idx];
    }
    throw new Error('User not found');
  }

  async findByInvitationToken(token: string): Promise<User | null> {
    return this.users.find(u => u.invitation_token === token) || null;
  }
}
