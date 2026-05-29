import { LogServiceImpl } from '../../../../../src/usecases/admin/logs/service/LogServiceImpl';

jest.mock('../../../../../src/repositories/database/SequelizeLogRepository', () => {
  return {
    SequelizeLogRepository: jest.fn().mockImplementation(() => {
      return {
        list: jest.fn().mockResolvedValue([{ id: 'log-1', action: 'user_created' }]),
        record: jest.fn().mockResolvedValue(undefined)
      };
    })
  };
});

describe('LogServiceImpl', () => {
  let logService: LogServiceImpl;

  beforeEach(() => {
    logService = new LogServiceImpl();
  });

  it('should list all logs', async () => {
    const logs = await logService.executeList();
    expect(logs).toEqual([{ id: 'log-1', action: 'user_created' }]);
  });

  it('should record a log', async () => {
    const data = {
      user_id: 'user-1',
      action: 'test_action',
      details: 'test details',
      ip_address: '127.0.0.1'
    };
    await expect(logService.record(data)).resolves.toBeUndefined();
  });
});
