import { ContractServiceImpl } from '../../../../../src/usecases/admin/contracts/service/ContractServiceImpl';

jest.mock('../../../../../src/repositories/database/SequelizeContractRepository', () => {
  return {
    SequelizeContractRepository: jest.fn().mockImplementation(() => {
      return {
        createContract: jest.fn().mockResolvedValue({ id: 'contract-1', client_id: 'client-1', total_value: 100 }),
        createContractItems: jest.fn().mockResolvedValue([]),
        findAllWithDetails: jest.fn().mockResolvedValue([{ id: 'contract-1' }]),
        deleteInstallmentsByContractId: jest.fn().mockResolvedValue(undefined),
        deleteContractItemsByContractId: jest.fn().mockResolvedValue(undefined),
        deleteContract: jest.fn().mockResolvedValue(undefined)
      };
    })
  };
});

jest.mock('../../../../../src/usecases/admin/billing/service/BillingServiceImpl', () => {
  return {
    BillingServiceImpl: jest.fn().mockImplementation(() => {
      return {
        generateInstallments: jest.fn().mockResolvedValue([])
      };
    })
  };
});

describe('ContractServiceImpl', () => {
  let contractService: ContractServiceImpl;

  beforeEach(() => {
    contractService = new ContractServiceImpl();
  });

  it('should list all contracts', async () => {
    const contracts = await contractService.listAll();
    expect(contracts).toEqual([{ id: 'contract-1' }]);
  });

  it('should create a full contract and generate installments', async () => {
    const contract = await contractService.createFullContract({
      client_id: 'client-1',
      total_value: 100,
      installments_count: 2,
      installment_value: 50,
      items: [{ item_type: 'service', service_id: 'srv-1', price: 100 }]
    });

    expect(contract).toEqual({ id: 'contract-1', client_id: 'client-1', total_value: 100 });
  });

  it('should throw an error if client_id is not provided', async () => {
    await expect(contractService.createFullContract({ total_value: 100 })).rejects.toThrow('ID do cliente é obrigatório para gerar o vínculo.');
  });

  it('should delete a contract with its items and installments', async () => {
    const result = await contractService.deleteContract('contract-1');
    expect(result).toEqual({ success: true });
  });
});
