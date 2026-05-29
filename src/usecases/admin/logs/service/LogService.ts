export interface LogService {
  executeList(): Promise<any[]>;
  record(data: {
    user_id?: string;
    action: string;
    details: string;
    ip_address?: string;
  }): Promise<void>;
}
