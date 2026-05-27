import { ClientSequelize } from '../../models/database/SequelizeClient';
import { ProfileSequelize } from '../../models/database/SequelizeProfile';
import { UserSequelize } from '../../models/database/SequelizeUser';

export interface ClientData {
  id: string;
  profile_id: string;
  company_name: string;
  company_category: string;
  badges?: string[];
  created_at?: string;
  updated_at?: string;
  profile?: {
    id: string;
    user_id: string;
    full_name: string;
    tax_id: string;
    phone: string;
    cep: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state?: string;
    instagram?: string;
    website?: string;
    user?: {
      email: string;
    }
  };
}

export class SequelizeClientRepository {
  async list(): Promise<ClientData[]> {
    const clients = await ClientSequelize.findAll({
      include: [
        {
          model: ProfileSequelize,
          as: 'profile',
          include: [
            {
              model: UserSequelize,
              as: 'user',
              attributes: ['email']
            }
          ]
        }
      ],
      order: [['company_name', 'ASC']]
    });

    return clients.map(c => c.get({ plain: true })) as any;
  }

  async create(data: { profile_id: string; company_name: string; company_category: string }): Promise<any> {
    const client = await ClientSequelize.create(data as any);
    return client.get({ plain: true });
  }

  async update(id: string, data: Partial<any>): Promise<any> {
    const client = await ClientSequelize.findByPk(id, {
      include: [{ model: ProfileSequelize, as: 'profile' }]
    });
    if (!client) throw new Error('Client not found');

    // Update client columns
    await client.update({
      company_name: data.company_name !== undefined ? data.company_name : client.company_name,
      company_category: data.category !== undefined ? data.category : (data.company_category !== undefined ? data.company_category : client.company_category),
      badges: data.badges !== undefined ? data.badges : (client as any).badges
    });

    // Update associated profile columns
    if (client.profile_id) {
      const profile = await ProfileSequelize.findByPk(client.profile_id);
      if (profile) {
        let formattedPhone = profile.phone;
        if (data.ddd !== undefined && data.phone !== undefined) {
          const cleanDdd = (data.ddd || '').replace(/\D/g, '');
          const cleanPhone = (data.phone || '').replace(/\D/g, '');
          if (cleanDdd && cleanPhone) {
            formattedPhone = `(${cleanDdd}) ${cleanPhone}`;
          }
        }

        await profile.update({
          full_name: data.name !== undefined ? data.name : profile.full_name,
          tax_id: data.tax_id !== undefined ? data.tax_id.replace(/\D/g, '') : profile.tax_id,
          phone: formattedPhone,
          cep: data.cep !== undefined ? data.cep.replace(/\D/g, '') : profile.cep,
          street: data.street !== undefined ? data.street : profile.street,
          number: data.number !== undefined ? data.number : profile.number,
          complement: data.complement !== undefined ? data.complement : profile.complement,
          neighborhood: data.neighborhood !== undefined ? data.neighborhood : profile.neighborhood,
          city: data.city !== undefined ? data.city : profile.city,
          state: data.state !== undefined ? data.state : (profile as any).state,
          instagram: data.instagram !== undefined ? data.instagram : (profile as any).instagram,
          website: data.website !== undefined ? data.website : (profile as any).website,
        });
      }
    }

    // Return the updated client with profile included
    const updatedClient = await ClientSequelize.findByPk(id, {
      include: [
        {
          model: ProfileSequelize,
          as: 'profile',
          include: [
            {
              model: UserSequelize,
              as: 'user',
              attributes: ['email']
            }
          ]
        }
      ]
    });

    return updatedClient ? updatedClient.get({ plain: true }) : null;
  }

  async delete(id: string): Promise<void> {
    const client = await ClientSequelize.findByPk(id);
    if (client) {
      await client.destroy();
    }
  }
}
