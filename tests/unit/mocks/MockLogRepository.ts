// @ts-nocheck
import { LogRepository } from '../../../src/repositories/LogRepository';

export class MockLogRepository implements LogRepository {
  public logs: any[] = [];

  async record(userId: string, action: string, details?: any): Promise<void> {
    this.logs.push({
      id: 'mock-log-' + Date.now(),
      user_id: userId,
      action,
      details,
      created_at: new Date()
    });
  }

  async list(filters?: any): Promise<any[]> {
    return this.logs;
  }
}
