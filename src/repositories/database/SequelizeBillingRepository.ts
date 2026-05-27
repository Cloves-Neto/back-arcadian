import { ContractSequelize } from '../../models/database/SequelizeContract';
import { InstallmentSequelize } from '../../models/database/SequelizeInstallment';
import { ContractItemSequelize } from '../../models/database/SequelizeContractItem';
import { ClientSequelize } from '../../models/database/SequelizeClient';
import { ProfileSequelize } from '../../models/database/SequelizeProfile';
import { UserSequelize } from '../../models/database/SequelizeUser';
import { BillingRepository } from '../BillingRepository';

export class SequelizeBillingRepository implements BillingRepository {
  async findAllContractsWithDetails(): Promise<any> {
    const res = await ContractSequelize.findAll({
      include: [
        {
          model: ClientSequelize as any,
          as: 'client',
          include: [{ model: ProfileSequelize as any, as: 'profile' }]
        },
        { model: InstallmentSequelize as any, as: 'installments' },
        { model: ContractItemSequelize as any, as: 'items' }
      ]
    });
    return res.map(r => r.get({ plain: true })) as any;
  }

  async findInstallmentsByContractId(contractId: string): Promise<any> {
    const res = await InstallmentSequelize.findAll({
      where: { contract_id: contractId },
      order: [['installment_number', 'ASC']]
    });
    return res.map(r => r.get({ plain: true })) as any;
  }

  async findInstallmentById(id: string): Promise<any> {
    const res = await InstallmentSequelize.findByPk(id);
    return res ? res.get({ plain: true }) as any : null;
  }

  async findContractById(id: string): Promise<any> {
    const res = await ContractSequelize.findByPk(id);
    return res ? res.get({ plain: true }) as any : null;
  }

  async findContractWithItems(id: string): Promise<any> {
    const res = await ContractSequelize.findByPk(id, {
      include: [{ model: ContractItemSequelize as any, as: 'items' }]
    });
    return res ? res.get({ plain: true }) as any : null;
  }

  async findContractWithProfileAndUser(id: string): Promise<any> {
    const res = await ContractSequelize.findByPk(id, {
      include: [{
        model: ClientSequelize as any,
        as: 'client',
        include: [{
          model: ProfileSequelize as any,
          as: 'profile',
          include: [{ model: UserSequelize as any, as: 'user' }]
        }]
      }]
    });
    return res ? res.get({ plain: true }) as any : null;
  }

  async findContractItems(contractId: string): Promise<any> {
    const res = await ContractItemSequelize.findAll({ where: { contract_id: contractId } });
    return res.map(r => r.get({ plain: true })) as any;
  }

  async updateInstallment(id: string, data: any): Promise<any> {
    const installment = await InstallmentSequelize.findByPk(id);
    if (!installment) return null;
    await installment.update(data);
    return installment.get({ plain: true }) as any;
  }

  async updateContract(id: string, data: any): Promise<any> {
    const contract = await ContractSequelize.findByPk(id);
    if (!contract) return null;
    await contract.update(data);
    return contract.get({ plain: true }) as any;
  }

  async bulkCreateInstallments(installments: any[]): Promise<any> {
    const res = await InstallmentSequelize.bulkCreate(installments as any);
    return res.map(r => r.get({ plain: true })) as any;
  }

  async findSpecificInstallment(contractId: string, installmentNumber: number): Promise<any> {
    const res = await InstallmentSequelize.findOne({
      where: { contract_id: contractId, installment_number: installmentNumber }
    });
    return res ? res.get({ plain: true }) as any : null;
  }

  async createInstallment(data: any): Promise<any> {
    const res = await InstallmentSequelize.create(data);
    return res.get({ plain: true }) as any;
  }
}
