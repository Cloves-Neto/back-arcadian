export default interface ChangePasswordService {
  execute(newPassword: string, userId?: string, token?: string): Promise<string>;
}
