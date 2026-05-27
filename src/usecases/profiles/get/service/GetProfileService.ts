export interface GetProfileService {
  execute(userId: string): Promise<any>;
}
