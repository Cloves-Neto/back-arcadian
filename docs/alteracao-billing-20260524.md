# Resumo da Alteração: Faturamento e Cobranças (Estágio 2.4)
Data: 24/05/2026

## Componentes Alterados

**Backend (`back-arcadian`):**
- O fluxo Administrativo já estava mapeado no `BillingServiceImpl` (Baixa Manual, Charge via Resend).
- Adicionada `src/usecases/client/billing/service/ClientBillingService.ts` e a respectiva implementação. Este serviço rastreia todas as faturas (parcelas) vinculadas aos contratos ativos do cliente.
- Criado `src/usecases/client/billing/controller/ClientBillingController.ts`.
- Injetada a rota `GET /client/billing` em `src/routers/ClientRouter.ts`.

**Frontend (`app-arcadian`):**
- Criada a camada isolada de requisição no arquivo `app/api/repositories/api/BillingRepository.ts`.
- Implementados os Controllers e Services OOP tanto para o Admin quanto para o Client Portal.
- Refatorado `features/billing/components/BillingManager.tsx`: Mock Removido. Faturamento mensal agora é mapeado a partir das faturas reais que compõem os Contratos de cada cliente.
- Refatorado `features/billing/components/BillingDetails.tsx`: Interatividade 100% operante. Ações de **Dar Baixa Manual (Confirmar/Estornar)** ativam a rota PATCH do back. Ação de **Cobrar** invoca o disparo de email via Resend (rota POST).
- Refatorado `features/client/components/ClientBillingManager.tsx`: Agora o portal do cliente lista exatamente as suas próprias parcelas provenientes da rota isolada `GET /client/billing`.

## Resumo
- **O Quê:** Gestão completa e isolada do Faturamento do arcabouço (Item 2.4).
- **Por Que:** Habilitar a baixa manual, disparos de email de cobrança via Admin, e dar transparência ao cliente logado para que ele possa acompanhar o status do próprio faturamento sem acessar o ecossistema Admin.
- **Como:** Reaproveitamos a inteligência e os endpoints que já residiam em `AdminRouter` + `BillingServiceImpl`, mas faltava plugar o ecossistema MVC/OOP do Client. No frontend, extirpamos os dicionários mockados `INITIAL_MOCKS` substituindo-os pelo Fetching real dos controllers nativos de nossa arquitetura.
