# Skill: Integrações (Resend, Multer, Supabase Storage)

Esta aplicação interage com serviços externos, especificamente para disparo de emails e armazenamento de mídias.

## 1. Disparo de Emails via Resend
A lib `resend` é adotada como provedor de envio de emails transacionais.
- Todos os emails disparados devem utilizar **Templates HTML**.
- Crie funções separadas (ex: `/utils/emailTemplates/`) ou em serviços específicos que geram a string do template (interpolando variáveis).
- Invoque a API do Resend no formato padrão:
  ```typescript
  resend.emails.send({
      from: '...',
      to: '...',
      subject: '...',
      html: htmlTemplate
  });
  ```

## 2. Upload de Arquivos (Multer -> Supabase Storage)
Arquivos e mídias **nunca** são armazenados localmente no servidor em produção.

- **Fluxo Multer**: 
  - Utilize o `multer` configurado para `memoryStorage()`. 
  - Dessa forma, o buffer do arquivo fica em memória sem poluir o disco do servidor.
- **Upload para o Supabase (Buckets)**:
  - Após interceptado pelo Multer na rota/controller, a `Service` repassa o buffer.
  - Uma Service de Upload deve usar o `supabase-js` para mandar este buffer (`req.file.buffer`) para um bucket do Supabase.
  - Trate o metadata e content-type corretamente na submissão.
