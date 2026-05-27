// @ts-nocheck
import { ServiceRepository } from '../../../src/repositories/ServiceRepository';

export class MockServiceRepository implements ServiceRepository {
  public services: any[] = [];

  async create(data: any): Promise<any> {
    const newService = { id: 'mock-service-' + Date.now(), ...data };
    this.services.push(newService);
    return newService;
  }

  async findById(id: string): Promise<any | null> {
    return this.services.find(s => s.id === id) || null;
  }

  async list(): Promise<any[]> {
    return this.services;
  }

  async update(id: string, data: any): Promise<any> {
    const serviceIndex = this.services.findIndex(s => s.id === id);
    if (serviceIndex > -1) {
      this.services[serviceIndex] = { ...this.services[serviceIndex], ...data };
      return this.services[serviceIndex];
    }
    return null;
  }

  async delete(id: string): Promise<void> {
    this.services = this.services.filter(s => s.id !== id);
  }
}
