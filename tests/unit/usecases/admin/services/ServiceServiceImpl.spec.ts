import { ServiceServiceImpl } from '../../../../../src/usecases/admin/services/service/ServiceServiceImpl';

jest.mock('../../../../../src/repositories/database/SequelizeServiceRepository', () => {
  return {
    SequelizeServiceRepository: jest.fn().mockImplementation(() => {
      return {
        listServices: jest.fn().mockResolvedValue([{ id: 'service-1', name: 'Service A' }]),
        createService: jest.fn().mockResolvedValue({ id: 'service-2', name: 'Service B' }),
        updateService: jest.fn().mockResolvedValue({ id: 'service-1', name: 'Updated Service' }),
        deleteService: jest.fn().mockResolvedValue(undefined),
        listSubscriptions: jest.fn().mockResolvedValue([{ id: 'sub-1' }]),
        createSubscription: jest.fn().mockResolvedValue({ id: 'sub-2' }),
        updateSubscription: jest.fn().mockResolvedValue({ id: 'sub-1', status: 'active' }),
        deleteSubscription: jest.fn().mockResolvedValue(undefined)
      };
    })
  };
});

describe('ServiceServiceImpl', () => {
  let serviceService: ServiceServiceImpl;

  beforeEach(() => {
    serviceService = new ServiceServiceImpl();
  });

  describe('Services', () => {
    it('should list services', async () => {
      const result = await serviceService.listServices();
      expect(result).toEqual([{ id: 'service-1', name: 'Service A' }]);
    });

    it('should create a service', async () => {
      const result = await serviceService.createService({ name: 'Service B' });
      expect(result).toEqual({ id: 'service-2', name: 'Service B' });
    });

    it('should update a service', async () => {
      const result = await serviceService.updateService('service-1', { name: 'Updated Service' });
      expect(result).toEqual({ id: 'service-1', name: 'Updated Service' });
    });

    it('should delete a service', async () => {
      await expect(serviceService.deleteService('service-1')).resolves.toBeUndefined();
    });
  });

  describe('Subscriptions', () => {
    it('should list subscriptions', async () => {
      const result = await serviceService.listSubscriptions();
      expect(result).toEqual([{ id: 'sub-1' }]);
    });

    it('should create a subscription', async () => {
      const result = await serviceService.createSubscription({ client_id: 'client-1' });
      expect(result).toEqual({ id: 'sub-2' });
    });

    it('should update a subscription', async () => {
      const result = await serviceService.updateSubscription('sub-1', { status: 'active' });
      expect(result).toEqual({ id: 'sub-1', status: 'active' });
    });

    it('should delete a subscription', async () => {
      await expect(serviceService.deleteSubscription('sub-1')).resolves.toBeUndefined();
    });
  });
});
