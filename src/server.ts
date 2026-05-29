import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import { CONFIG } from './utils/config';
import { stream } from './utils/logger';
import { errorMiddleware } from './middlewares/errorMiddleware';
import SequelizeSingletonConnection from './config/database/SequelizeSingletonConnection';

import UserRouter from './routers/UserRouter';
import AuthRouter from './routers/AuthRouter';
import AdminRouter from './routers/AdminRouter';
import ClientRouter from './routers/ClientRouter';

// ─── App Setup ───────────────────────────────────────────────────────────────

const app = express();
export { app };

app.use(cors({ origin: CONFIG.ALLOWED_ORIGINS }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream }));

// Swagger
const swaggerDocument = YAML.load(path.join(process.cwd(), 'docs/swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routers
app.use('/api/v1', UserRouter);
app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/admin', AdminRouter);
app.use('/api/v1', ClientRouter);

// Error Handler
app.use(errorMiddleware);

// Health checks
app.get('/health', (_, res) => res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() }));
app.get('/test', (_, res) => res.status(200).json({ status: 'test-ok' }));

// ─── Bootstrap ───────────────────────────────────────────────────────────────

const PORT = CONFIG.PORT || 3001;

async function bootstrap() {
  try {
    console.log('🏗️  Starting server boot sequence...');

    await SequelizeSingletonConnection.authenticate();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`✅ Health check: /health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
