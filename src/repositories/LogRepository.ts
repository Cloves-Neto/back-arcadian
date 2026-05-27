export interface LogRepository {
  list(): Promise<any[]>;
  record(data: { user_id?: string; action: string; details: string; ip_address?: string }): Promise<void>;
}
