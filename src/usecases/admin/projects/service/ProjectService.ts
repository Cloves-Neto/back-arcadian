export default interface ProjectService {
  create(data: any): Promise<any>;
  list(): Promise<any[]>;
  getById(id: string): Promise<any | null>;
  update(id: string, data: any): Promise<any | null>;
  delete(id: string): Promise<void>;
}
