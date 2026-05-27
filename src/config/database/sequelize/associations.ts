import { ClientSequelize } from '../../../models/database/SequelizeClient';
import { ContractSequelize } from '../../../models/database/SequelizeContract';
import { InstallmentSequelize } from '../../../models/database/SequelizeInstallment';
import { ProfileSequelize } from '../../../models/database/SequelizeProfile';
import { UserSequelize } from '../../../models/database/SequelizeUser';
import { ContractItemSequelize } from '../../../models/database/SequelizeContractItem';
import { ServiceSequelize } from '../../../models/database/SequelizeService';
import { SubscriptionSequelize } from '../../../models/database/SequelizeSubscription';

export const setupAssociations = () => {
  // User <-> Profile
  UserSequelize.hasOne(ProfileSequelize, { foreignKey: 'user_id', as: 'profile' });
  ProfileSequelize.belongsTo(UserSequelize, { foreignKey: 'user_id', as: 'user' });

  // Profile <-> Client
  ProfileSequelize.hasOne(ClientSequelize, { foreignKey: 'profile_id', as: 'client' });
  ClientSequelize.belongsTo(ProfileSequelize, { foreignKey: 'profile_id', as: 'profile' });

  // Client <-> Contract
  ClientSequelize.hasMany(ContractSequelize, { foreignKey: 'client_id', as: 'contracts' });
  ContractSequelize.belongsTo(ClientSequelize, { foreignKey: 'client_id', as: 'client' });

  // Contract <-> Installment
  ContractSequelize.hasMany(InstallmentSequelize, { foreignKey: 'contract_id', as: 'installments' });
  InstallmentSequelize.belongsTo(ContractSequelize, { foreignKey: 'contract_id', as: 'contract' });

  // Contract <-> ContractItem
  ContractSequelize.hasMany(ContractItemSequelize, { foreignKey: 'contract_id', as: 'items' });
  ContractItemSequelize.belongsTo(ContractSequelize, { foreignKey: 'contract_id', as: 'contract' });

  // ContractItem <-> Service/Subscription
  ContractItemSequelize.belongsTo(ServiceSequelize, { foreignKey: 'service_id', as: 'service' });
  ContractItemSequelize.belongsTo(SubscriptionSequelize, { foreignKey: 'subscription_id', as: 'subscription' });
};
