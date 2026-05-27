import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { LogServiceImpl } from '../usecases/admin/logs/service/LogServiceImpl';

export const errorMiddleware = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || 'Erro interno no servidor.';

  // Log no arquivo/console
  logger.error(`[${req.method}] ${req.url} >> StatusCode:: ${status}, Message:: ${message}`);
  if (err.stack) {
    logger.error(err.stack);
  }

  // Se for um erro do servidor (500), gravar no banco via LogService
  if (status === 500) {
    try {
      const logService = new LogServiceImpl();
      await logService.record({
        action: 'INTERNAL_SERVER_ERROR',
        details: `Erro na rota ${req.url}: ${message}`,
      });
    } catch (logErr) {
      logger.error('Falha ao tentar gravar log de erro no banco de dados:', logErr);
    }
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
