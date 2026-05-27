import { Request, Response } from 'express';
import { ClientDashboardServiceImpl } from '../service/ClientDashboardServiceImpl';

export class ClientDashboardController {
  async handle(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const service = new ClientDashboardServiceImpl();
      const result = await service.execute(userId);

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Error in ClientDashboardController:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Error fetching dashboard data'
      });
    }
  }
}
