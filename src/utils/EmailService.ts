import { Resend } from 'resend';
import * as fs from 'fs';
import * as path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  private static async sendOrSimulate(type: string, payload: { from: string, to: string, subject: string, html: string }) {
    const simulate = process.env.SIMULATE_RESEND === 'true';

    if (simulate) {
      console.log(`\n============== [SIMULATOR] E-MAIL DETECTADO (Tipo: ${type}) ==============`);
      console.log(`Para: ${payload.to}`);
      console.log(`De: ${payload.from}`);
      console.log(`Assunto: ${payload.subject}`);
      
      try {
        const scratchDir = path.join(__dirname, '../../scratch/simulated-emails');
        if (!fs.existsSync(scratchDir)) {
          fs.mkdirSync(scratchDir, { recursive: true });
        }
        
        // Remove old simulation files first to keep it clean for tests
        const files = fs.readdirSync(scratchDir);
        for (const file of files) {
          fs.unlinkSync(path.join(scratchDir, file));
        }

        const filename = `email-${Date.now()}-${type}.html`;
        const filePath = path.join(scratchDir, filename);
        fs.writeFileSync(filePath, payload.html, 'utf-8');
        
        console.log(`[SIMULATOR] Corpo do e-mail salvo em: ${filePath}`);
        console.log(`=========================================================================\n`);
      } catch (err) {
        console.error('[SIMULATOR] Erro ao salvar HTML localmente:', err);
      }
      return { data: { id: `sim-${Date.now()}` }, error: null };
    } else {
      return await resend.emails.send(payload);
    }
  }

  static async sendInvitation(email: string, fullName: string, token: string) {
    const inviteUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    try {
      const { data, error } = await this.sendOrSimulate('invitation', {
        from: 'Arcadia Hub <hub@arcadiacs.com.br>',
        to: email,
        subject: 'Convite para o Arcadian Hub',
        html: `
          <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.05); border: 1px solid #f0f0f0;">
            <!-- Header with Logo -->
            <div style="background-color: #000000; padding: 40px; text-align: center;">
              <img src="https://www.arcadiacs.com.br/logo-arcadia.png" alt="Arcadia Logo" style="width: 180px; height: auto;">
            </div>
            
            <!-- Content -->
            <div style="padding: 48px 40px; color: #1a1a1a;">
              <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 24px; color: #000000; letter-spacing: -0.5px;">Olá, ${fullName}!</h1>
              <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin-bottom: 32px;">
                É um prazer receber você no <strong>Arcadian Hub</strong>. <br/>
                Sua conta exclusiva para gestão de projetos e serviços da Arcadia Creative Studio já está pronta.
              </p>
              
              <p style="font-size: 15px; color: #666; margin-bottom: 12px; font-weight: 600;">O que você encontrará no Hub:</p>
              <ul style="padding-left: 20px; margin-bottom: 32px; color: #666; font-size: 14px; line-height: 1.8;">
                <li>Acompanhamento de projetos em tempo real</li>
                <li>Gestão de vínculos e faturas</li>
                <li>Suporte direto e arquivos exclusivos</li>
              </ul>

              <div style="text-align: center; margin: 40px 0;">
                <a href="${inviteUrl}" style="background: #000000; color: #ffffff; padding: 18px 36px; text-decoration: none; border-radius: 14px; font-weight: 700; font-size: 15px; display: inline-block; transition: all 0.3s;">
                  Ativar Minha Conta
                </a>
              </div>
              
              <p style="font-size: 13px; color: #999; text-align: center; margin-top: 32px;">
                Este convite é válido por 24 horas. <br/>
                Se você não esperava este e-mail, pode ignorá-lo com segurança.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9f9f9; padding: 32px; text-align: center; border-top: 1px solid #eeeeee;">
              <p style="font-size: 12px; color: #aaaaaa; margin: 0;">&copy; ${new Date().getFullYear()} Arcadia Creative Studio. Todos os direitos reservados.</p>
              <p style="font-size: 12px; color: #aaaaaa; margin-top: 8px;">www.arcadiacs.com.br</p>
            </div>
          </div>
        `,
      });

      if (error) {
        console.error('[Resend Error]:', error);
        throw error;
      }

      console.log(`Email enviado com sucesso para ${email}. ID:`, data?.id);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      // Não trava o fluxo se for erro de email, mas avisa no log
    }
  }

  static async sendBillingEmail(contract: any, installment: any, isOverdue: boolean) {
    const email = contract.client.profile.user.email;
    const fullName = contract.client.profile.full_name;
    const dueDate = new Date(installment.due_date).toLocaleDateString('pt-BR');
    const value = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(installment.value);
    
    const subject = isOverdue 
      ? `FATURA VENCIDA: Pagamento pendente (${installment.installment_number}/${installment.total_installments})`
      : `Lembrete de Pagamento: Sua fatura vence em breve (${dueDate})`;

    const title = isOverdue ? 'Atenção: Fatura Pendente' : 'Lembrete de Pagamento';
    const message = isOverdue 
      ? `Identificamos que a sua parcela com vencimento em <strong>${dueDate}</strong> ainda não foi compensada.`
      : `Gostaríamos de lembrar que sua próxima parcela no valor de <strong>${value}</strong> vence no dia <strong>${dueDate}</strong>.`;

    try {
      const { data, error } = await this.sendOrSimulate('billing', {
        from: 'Arcadia Hub <hub@arcadiacs.com.br>',
        to: email,
        subject: subject,
        html: `
          <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.05); border: 1px solid #f0f0f0;">
            <div style="background-color: ${isOverdue ? '#ff4d67' : '#000000'}; padding: 40px; text-align: center;">
              <img src="https://www.arcadiacs.com.br/logo-arcadia.png" alt="Arcadia Logo" style="width: 180px; height: auto;">
            </div>
            
            <div style="padding: 48px 40px; color: #1a1a1a;">
              <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 24px; color: #000000;">${title}</h1>
              <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin-bottom: 32px;">
                Olá, ${fullName}. <br/>
                ${message}
              </p>
              
              <div style="background-color: #f8f8f8; padding: 24px; border-radius: 16px; margin-bottom: 32px;">
                <p style="margin: 0; font-size: 14px; color: #666;">Detalhes da Parcela:</p>
                <p style="margin: 8px 0 0; font-size: 18px; font-weight: 700; color: #000;">${installment.installment_number}/${installment.total_installments} — ${value}</p>
                <p style="margin: 4px 0 0; font-size: 14px; color: ${isOverdue ? '#ff4d67' : '#666'}; font-weight: 600;">Vencimento: ${dueDate}</p>
              </div>

              <div style="text-align: center; margin: 40px 0;">
                <a href="${process.env.FRONTEND_URL}/dashboard/pagamentos" style="background: #000000; color: #ffffff; padding: 18px 36px; text-decoration: none; border-radius: 14px; font-weight: 700; font-size: 15px; display: inline-block;">
                  Ver Detalhes no Portal
                </a>
              </div>
              
              <p style="font-size: 13px; color: #999; text-align: center;">
                Se você já realizou o pagamento, por favor ignore este e-mail. <br/>
                Dúvidas? Entre em contato com nosso financeiro.
              </p>
            </div>
            
            <div style="background-color: #f9f9f9; padding: 32px; text-align: center; border-top: 1px solid #eeeeee;">
              <p style="font-size: 12px; color: #aaaaaa; margin: 0;">&copy; ${new Date().getFullYear()} Arcadia Creative Studio. Todos os direitos reservados.</p>
            </div>
          </div>
        `,
      });

      if (error) {
        console.error('[Resend Error]:', error);
        throw error;
      }
    } catch (error) {
      console.error('Erro ao enviar email de cobrança:', error);
    }
  }
}

