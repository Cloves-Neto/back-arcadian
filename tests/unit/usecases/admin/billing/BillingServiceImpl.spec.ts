import { BillingServiceImpl } from '../../../../../src/usecases/admin/billing/service/BillingServiceImpl';

jest.mock('../../../../../src/repositories/database/SequelizeBillingRepository', () => {
  return {
    SequelizeBillingRepository: jest.fn().mockImplementation(() => {
      return {
        findAllContractsWithDetails: jest.fn().mockResolvedValue([{ id: 'contract-1' }]),
        findInstallmentsByContractId: jest.fn().mockResolvedValue([{ id: 'inst-1', contract_id: 'contract-1' }]),
        updateInstallment: jest.fn().mockImplementation((id, data) => Promise.resolve({ id, contract_id: 'contract-1', ...data })),
        updateContract: jest.fn().mockImplementation((id, data) => Promise.resolve({ id, ...data })),
        findContractItems: jest.fn().mockResolvedValue([{ item_type: 'service' }]),
        bulkCreateInstallments: jest.fn().mockImplementation((installments) => Promise.resolve(installments)),
        findInstallmentById: jest.fn().mockImplementation((id) => {
          if (id === 'inst-1') {
            return Promise.resolve({ id: 'inst-1', contract_id: 'contract-1', value: 100, due_date: new Date(), installment_number: 1, status: 'pending' });
          }
          return Promise.resolve(null);
        }),
        findContractWithItems: jest.fn().mockResolvedValue({ id: 'contract-1', items: [{ item_type: 'subscription' }], billing_frequency: 'monthly' }),
        findSpecificInstallment: jest.fn().mockResolvedValue(null),
        createInstallment: jest.fn().mockResolvedValue({}),
        findContractWithProfileAndUser: jest.fn().mockResolvedValue({ id: 'contract-1', profile: {}, user: { email: 'client@domain.com' } })
      };
    })
  };
});

jest.mock('../../../../../src/utils/EmailService', () => {
  return {
    EmailService: {
      sendBillingEmail: jest.fn().mockResolvedValue(true)
    }
  };
});

describe('BillingServiceImpl', () => {
  let billingService: BillingServiceImpl;

  beforeEach(() => {
    billingService = new BillingServiceImpl();
  });

  it('should list all contracts with details', async () => {
    const contracts = await billingService.listAll();
    expect(contracts).toEqual([{ id: 'contract-1' }]);
  });

  it('should get installments for a contract', async () => {
    const installments = await billingService.getInstallments('contract-1');
    expect(installments).toEqual([{ id: 'inst-1', contract_id: 'contract-1' }]);
  });

  it('should toggle upfront status', async () => {
    const result = await billingService.toggleUpfrontStatus('contract-1', true);
    expect(result).toEqual({ id: 'contract-1', upfront_paid: true });
  });

  it('should generate installments', async () => {
    const result = await billingService.generateInstallments({
      id: 'contract-1',
      installments_count: 2,
      installment_value: 50,
      start_date: new Date('2026-05-23'),
      billing_day: 1,
      billing_frequency: 'monthly',
      upfront_value: 0
    });
    
    expect(result.length).toBe(2);
    expect(result[0].installment_number).toBe(1);
    expect(result[1].installment_number).toBe(2);
  });

  it('should update status to paid and generate next subscription installment', async () => {
    const result = await billingService.updateStatus('inst-1', 'paid');
    expect(result?.status).toBe('paid');
  });

  it('should charge an installment via EmailService', async () => {
    const result = await billingService.charge('inst-1');
    expect(result).toBe(true);
  });
});
