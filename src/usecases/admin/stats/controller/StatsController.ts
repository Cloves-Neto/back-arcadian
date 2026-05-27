import { Request, Response } from 'express';
import { StatsServiceImpl } from '../service/StatsServiceImpl';

export class StatsController {
  async handle(req: Request, res: Response) {
    const statsService = new StatsServiceImpl();

    try {
      const stats = await statsService.execute();
      return res.json(stats);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
