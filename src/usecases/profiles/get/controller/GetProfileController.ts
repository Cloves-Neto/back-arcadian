import { Request, Response } from 'express';
import GetProfileServiceImpl from '../service/GetProfileServiceImpl';

export class GetProfileController {
  async handle(req: any, res: Response) {
    try {
      const userId = req.query.user_id || req.user.id;
      const getProfileService = new GetProfileServiceImpl();
      const profile = await getProfileService.execute(userId);

      return res.status(200).json({ 
        status: 'success', 
        data: profile 
      });
    } catch (error: any) {
      console.error('[GET /me Error]:', error);
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
}
