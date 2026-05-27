import { Request, Response } from 'express';
import UpdateProfileServiceImpl from '../service/UpdateProfileServiceImpl';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../../../utils/supabase';

export class UpdateProfileController {
  async handle(req: any, res: Response) {
    try {
      const { 
        full_name, 
        phone, 
        tax_id, 
        cep, 
        street, 
        number, 
        complement, 
        neighborhood, 
        city, 
        state, 
        instagram, 
        website, 
        user_id 
      } = req.body;
      const userId = user_id || req.user.id;

      const updateProfileService = new UpdateProfileServiceImpl();
      const profile = await updateProfileService.execute(userId, { 
        full_name,
        phone,
        tax_id,
        cep,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        instagram,
        website
      });

      return res.status(200).json({ 
        status: 'success', 
        data: profile 
      });
    } catch (error: any) {
      console.error('[PUT /me Error]:', error);
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async updateAvatar(req: any, res: Response) {
    try {
      const userId = req.user.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      }

      const fileExt = file.originalname.split('.').pop();
      const fileName = `${userId}-${uuidv4()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatar_url')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatar_url')
        .getPublicUrl(filePath);

      const updateProfileService = new UpdateProfileServiceImpl();
      await updateProfileService.updateAvatar(userId, publicUrl);

      return res.status(200).json({ 
        status: 'success', 
        url: publicUrl 
      });
    } catch (error: any) {
      console.error('[Avatar Upload Error]:', error);
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
}
