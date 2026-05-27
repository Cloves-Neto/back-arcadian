import express from 'express';
import cors from 'cors';
import { CONFIG } from './utils/config';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { stream } from './utils/logger';
import { errorMiddleware } from './middlewares/errorMiddleware';

import UserRouter from './routers/UserRouter';
import AuthRouter from './routers/AuthRouter';
import AdminRouter from './routers/AdminRouter';
import ClientRouter from './routers/ClientRouter';

const app = express();

app.use(cors({ origin: CONFIG.ALLOWED_ORIGINS }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream }));

// Swagger setup
const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routers
app.use('/api/v1', UserRouter);
app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/admin', AdminRouter);
app.use('/api/v1', ClientRouter);

// Error Handler
app.use(errorMiddleware);

// Health check
app.get('/health', (_, res) => res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() }));
app.get('/test', (_, res) => res.status(200).json({ status: 'test-ok' }));

export default app;
