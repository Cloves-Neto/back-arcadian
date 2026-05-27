import { BannerSequelize } from '../../../../models/database/SequelizeBanner';
import { NotificationSequelize } from '../../../../models/database/SequelizeNotification';

export class AlertsServiceImpl {
  // === BANNERS ===
  async createBanner(data: any) {
    const banner = await BannerSequelize.create(data);
    return banner.get({ plain: true });
  }

  async listBanners() {
    const banners = await BannerSequelize.findAll({ order: [['created_at', 'DESC']] });
    return banners.map((b: any) => b.get({ plain: true }));
  }

  async updateBanner(id: string, data: any) {
    const banner = await BannerSequelize.findByPk(id);
    if (!banner) throw new Error('Banner not found');
    await banner.update(data);
    return banner.get({ plain: true });
  }

  async deleteBanner(id: string) {
    const banner = await BannerSequelize.findByPk(id);
    if (banner) {
      await banner.destroy();
    }
  }

  // === NOTIFICATIONS ===
  async createNotification(data: any) {
    // Se não tiver client_id, cria para todos (lógica simplificada para o MVP)
    // Se tiver, cria para um específico
    const notification = await NotificationSequelize.create(data);
    return notification.get({ plain: true });
  }

  async listNotifications() {
    const notifications = await NotificationSequelize.findAll({ order: [['created_at', 'DESC']] });
    return notifications.map((n: any) => n.get({ plain: true }));
  }

  async deleteNotification(id: string) {
    const notification = await NotificationSequelize.findByPk(id);
    if (notification) {
      await notification.destroy();
    }
  }
}
