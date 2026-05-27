export interface StatsRepository {
  getStats(): Promise<{
    total_users: number;
    total_clients: number;
    total_services: number;
    total_revenue: number;
    pending_steps_this_month: number;
    calendar_dots: string[];
  }>;
}
