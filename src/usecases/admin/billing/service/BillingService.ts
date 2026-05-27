export interface BillingService {
  listAll(): Promise<any>;
  getInstallments(contractId: string): Promise<any>;
  updateStatus(id: string, status: string, paid_amount?: number, payment_date?: string | Date): Promise<any>;
  toggleUpfrontStatus(id: string, upfront_paid: boolean): Promise<any>;
  charge(id: string): Promise<any>;
  markAsPaid(installmentId: string, paidAmount?: number, paymentDate?: Date): Promise<any>;
  generateInstallments(contract: any): Promise<any>;
}
