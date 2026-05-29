import { Request, Response } from 'express';
import { LogServiceImpl } from '../service/LogServiceImpl';

export default class ListLogsController {
  private service: LogServiceImpl;

  constructor() {
    this.service = new LogServiceImpl();
  }

  async handle(req: Request, res: Response) {
    try {
      const logs = await this.service.executeList();
      return res.status(200).json(logs);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
