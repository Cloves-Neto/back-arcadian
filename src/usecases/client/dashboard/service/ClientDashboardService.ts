export interface ClientDashboardService {
  execute(userId: string): Promise<any>;
}
