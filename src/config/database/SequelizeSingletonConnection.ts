import { Sequelize } from 'sequelize-typescript';
import { CONFIG } from '../../utils/config';
import * as pg from 'pg';

import { UserSequelize } from '../../models/database/SequelizeUser';
import { ProfileSequelize } from '../../models/database/SequelizeProfile';
import { ClientSequelize } from '../../models/database/SequelizeClient';
import { ContractSequelize } from '../../models/database/SequelizeContract';
import { InstallmentSequelize } from '../../models/database/SequelizeInstallment';
import { ContractItemSequelize } from '../../models/database/SequelizeContractItem';
import { ServiceSequelize } from '../../models/database/SequelizeService';
import { SubscriptionSequelize } from '../../models/database/SequelizeSubscription';
import { ActivityLogSequelize } from '../../models/database/SequelizeActivityLog';
import { PaymentSequelize } from '../../models/database/SequelizePayment';
import { TaskSequelize } from '../../models/database/SequelizeTask';
import { BannerSequelize } from '../../models/database/SequelizeBanner';
import { NotificationSequelize } from '../../models/database/SequelizeNotification';
import { SequelizeProject } from '../../models/database/SequelizeProject';
import { SequelizeProjectStage } from '../../models/database/SequelizeProjectStage';
import { SequelizeProjectStep } from '../../models/database/SequelizeProjectStep';
import { SequelizeTaskTodo } from '../../models/database/SequelizeTaskTodo';
import { setupAssociations } from './sequelize/associations';

export default class SequelizeSingletonConnection {
  private static SEQUELIZE: Sequelize;

  private constructor() {}

  public static getSequelize(): Sequelize {
    if (!SequelizeSingletonConnection.SEQUELIZE) {
      SequelizeSingletonConnection.SEQUELIZE = SequelizeSingletonConnection.connect();
    }
    return SequelizeSingletonConnection.SEQUELIZE;
  }

  private static connect(): Sequelize {
    const sequelize = new Sequelize(CONFIG.DATABASE_URL, {
      dialect: 'postgres',
      dialectModule: pg,
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Necessário para Supabase dependendo do plano, ou ca base64
        },
      },
    });

    // Registra os modelos
    sequelize.addModels([
      UserSequelize,
      ProfileSequelize,
      ClientSequelize,
      ContractSequelize,
      InstallmentSequelize,
      ContractItemSequelize,
      ServiceSequelize,
      SubscriptionSequelize,
      ActivityLogSequelize,
      PaymentSequelize,
      TaskSequelize,
      BannerSequelize,
      NotificationSequelize,
      SequelizeProject,
      SequelizeProjectStage,
      SequelizeProjectStep,
      SequelizeTaskTodo,
    ]);

    // Configura as associações
    setupAssociations();

    return sequelize;
  }

  public static async authenticate(): Promise<void> {
    const sequelize = this.getSequelize();
    try {
      await sequelize.authenticate();
      console.log('✅ Database connected successfully via Singleton');
    } catch (error) {
      console.error('❌ Unable to connect to the database:', error);
      process.exit(1);
    }
  }
}
