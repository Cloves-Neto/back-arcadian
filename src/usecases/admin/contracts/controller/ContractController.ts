import { Request, Response } from 'express';
import { ContractServiceImpl } from '../service/ContractServiceImpl';

export class ContractController {
  private service: ContractServiceImpl;

  constructor() {
    this.service = new ContractServiceImpl();
  }

  async create(req: Request, res: Response) {
    try {
      console.log("Creating contract with data:", JSON.stringify(req.body, null, 2));
      const contract = await this.service.createFullContract(req.body);

      return res.status(201).json({
        success: true,
        data: contract
      });
    } catch (error: any) {
      console.error("Contract creation error:", error);
      return res.status(400).json({
        success: false,
        message: error.message,
        details: error.errors || error
      });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const contracts = await this.service.listAll();
      return res.status(200).json({
        success: true,
        data: contracts
      });
    } catch (error: any) {
      console.error("Contract list error:", error);
      return res.status(400).json({
        success: false,
        message: error.message,
        details: error.errors || error
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.service.deleteContract(id as string);
      return res.status(200).json({
        success: true,
        message: "Contrato excluído com sucesso."
      });
    } catch (error: any) {
      console.error("Contract delete error:", error);
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.service.updateContract(id as string, req.body);
      return res.status(200).json({
        success: true,
        message: "Contrato atualizado com sucesso."
      });
    } catch (error: any) {
      console.error("Contract update error:", error);
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}
