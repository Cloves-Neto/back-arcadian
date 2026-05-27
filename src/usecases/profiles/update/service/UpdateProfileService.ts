export interface UpdateProfileService {
  execute(userId: string, data: any): Promise<any>;
  updateAvatar(userId: string, avatarUrl: string): Promise<void>;
}
