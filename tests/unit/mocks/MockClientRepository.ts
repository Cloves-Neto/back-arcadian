import { ClientRepository } from '../../../src/repositories/ClientRepository';


export class MockClientRepository implements ClientRepository {
  private clients: any[] = [];

  async create(data: any): Promise<any> {
    const newClient = { id: 'client-mock-id', ...data };
    this.clients.push(newClient);
    return newClient;
  }

  async update(id: string, data: any): Promise<any> {
    const idx = this.clients.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.clients[idx] = { ...this.clients[idx], ...data };
      return this.clients[idx];
    }
    throw new Error('Client not found');
  }

  async findByProfileId(profileId: string): Promise<any> {
    return this.clients.find(c => c.profile_id === profileId) || null;
  }

  async delete(id: string): Promise<void> {
    this.clients = this.clients.filter(c => c.id !== id);
  }

  async list(): Promise<any[]> {
    return this.clients;
  }
}
