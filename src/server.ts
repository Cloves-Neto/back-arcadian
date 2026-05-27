import app from './app';
import { CONFIG } from './utils/config';
import SequelizeSingletonConnection from './config/database/SequelizeSingletonConnection';

const PORT = CONFIG.PORT || 3001;

async function bootstrap() {
  try {
    console.log('🏗️ Starting server boot sequence...');
    
    // Connect to database
    await SequelizeSingletonConnection.authenticate();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`✅ Health check available at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
