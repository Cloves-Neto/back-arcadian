import { ContractSequelize } from '../../models/database/SequelizeContract';
import { ContractItemSequelize } from '../../models/database/SequelizeContractItem';
import { InstallmentSequelize } from '../../models/database/SequelizeInstallment';
import { ClientSequelize } from '../../models/database/SequelizeClient';
import { ProfileSequelize } from '../../models/database/SequelizeProfile';
import { UserSequelize } from '../../models/database/SequelizeUser';
import { ServiceSequelize } from '../../models/database/SequelizeService';
import { SubscriptionSequelize } from '../../models/database/SequelizeSubscription';
import { ContractRepository } from '../ContractRepository';

export class SequelizeContractRepository implements ContractRepository {
  async createContract(data: any): Promise<any> {
    const res = await ContractSequelize.create(data as any);
    return res.get({ plain: true }) as any;
  }

  async createContractItems(items: any[]): Promise<any> {
    const res = await ContractItemSequelize.bulkCreate(items);
    return res.map(r => r.get({ plain: true })) as any;
  }

  async findAllWithDetails(): Promise<any> {
    const res = await ContractSequelize.findAll({
      include: [
        {
          model: ClientSequelize as any,
          as: 'client',
          include: [{ 
            model: ProfileSequelize as any, 
            as: 'profile',
            include: [{ model: UserSequelize as any, as: 'user' }]
          }]
        },
        { model: InstallmentSequelize as any, as: 'installments' },
        {
          model: ContractItemSequelize as any,
          as: 'items',
          include: [
            { model: ServiceSequelize as any, as: 'service' },
            { model: SubscriptionSequelize as any, as: 'subscription' }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });
    return res.map(r => r.get({ plain: true })) as any;
  }

  async deleteInstallmentsByContractId(contractId: string): Promise<any> {
    return await InstallmentSequelize.destroy({ where: { contract_id: contractId } });
  }

  async deleteContractItemsByContractId(contractId: string): Promise<any> {
    return await ContractItemSequelize.destroy({ where: { contract_id: contractId } });
  }

  async deleteContract(id: string): Promise<any> {
    return await ContractSequelize.destroy({ where: { id } });
  }

  async updateContract(id: string, data: any): Promise<any> {
    return await ContractSequelize.update(data, { where: { id } });
  }
}
