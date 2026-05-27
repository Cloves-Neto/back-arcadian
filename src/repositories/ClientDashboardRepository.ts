import { Contract } from '../models/database/Contract';
import { Profile } from '../models/database/Profile';

export interface ClientDashboardRepository {
  getClientProfileWithAssociations(userId: string): Promise<Profile | null>;
  getActiveContractsWithInstallments(clientId: string): Promise<Contract[]>;
  getProjectsByContractIds(contractIds: string[]): Promise<any[]>;
}
