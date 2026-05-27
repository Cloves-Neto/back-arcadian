import { Sequelize } from 'sequelize';
import { CONFIG } from '../src/utils/config';

async function run() {
  try {
    const sequelize = new Sequelize(CONFIG.DATABASE_URL as string, {
      dialect: 'postgres',
      dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
    });
    await sequelize.authenticate();
    console.log('Connected to DB');
    
    // Add columns if they don't exist
    await sequelize.query(`ALTER TABLE contracts ADD COLUMN IF NOT EXISTS service_ids JSONB DEFAULT '[]'::jsonb`);
    await sequelize.query(`ALTER TABLE contracts ADD COLUMN IF NOT EXISTS upfront_paid BOOLEAN DEFAULT false`);
    
    console.log('Columns added successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error adding columns:', error);
    process.exit(1);
  }
}

run();
