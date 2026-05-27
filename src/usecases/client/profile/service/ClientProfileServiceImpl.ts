import { ClientProfileService } from './ClientProfileService';
import { ProfileSequelize } from '../../../../models/database/SequelizeProfile';
import { ClientSequelize } from '../../../../models/database/SequelizeClient';
import { UserSequelize } from '../../../../models/database/SequelizeUser';

export class ClientProfileServiceImpl implements ClientProfileService {
  async getProfile(userId: string) {
    const profile = await ProfileSequelize.findOne({
      where: { user_id: userId },
      include: [{ model: ClientSequelize, as: 'client' }]
    });

    if (!profile) {
      throw new Error('Profile not found');
    }

    return {
      ...profile.get(),
      client: (profile as any).client ? (profile as any).client.get() : null
    };
  }

  async updateProfile(userId: string, data: any) {
    const { 
      full_name, 
      tax_id, 
      phone, 
      company_name,
      category,
      cep,
      street,
      number,
      complement,
      neighborhood,
      city
    } = data;

    const cleanTaxId = tax_id?.replace(/\D/g, "") || "";
    const cleanPhone = phone?.replace(/\D/g, "") || "";

    // 1. Update User
    await UserSequelize.update(
      { must_change_password: false },
      { where: { id: userId } }
    );

    // 2. Update Profile
    const [profile] = await ProfileSequelize.findOrCreate({
      where: { user_id: userId },
      defaults: { full_name: full_name || '', user_id: userId } as any
    });

    await profile.update({
      full_name: full_name || profile.full_name,
      tax_id: cleanTaxId || profile.tax_id,
      phone: cleanPhone || profile.phone,
      cep,
      street,
      number,
      complement,
      neighborhood,
      city,
      onboarding: true
    });

    // 3. Update Client
    const [clientRecord] = await ClientSequelize.findOrCreate({
      where: { profile_id: profile.id },
      defaults: { profile_id: profile.id, company_name, company_category: category } as any
    });

    await clientRecord.update({
      company_name: company_name || clientRecord.company_name,
      company_category: category || clientRecord.company_category
    });

    return {
      ...profile.get(),
      client: clientRecord.get()
    };
  }
}
