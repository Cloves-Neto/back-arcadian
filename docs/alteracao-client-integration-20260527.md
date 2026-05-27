# Resumo da Alteração: Correções de Integração do Portal do Cliente

**Data:** 27/05/2026  
**Autor:** JoyBoy (IA Agent)  
**Referência:** Correções nas APIs e Mapeamentos do Portal do Cliente  

## O Quê (O que foi feito?)
1. **Fallback de Autocura de Sessão (401):** Modificado o controller `ClientProjectController.ts` para buscar o `profile_id` diretamente no banco a partir do `req.user.id` caso o claim correspondente esteja ausente no token JWT do cliente.
2. **Correção de Associação nos Itens do Contrato:** Corrigido o repositório `SequelizeClientDashboardRepository.ts` para incluir as tabelas associadas de serviços (`ServiceSequelize`) e assinaturas (`SubscriptionSequelize`) dentro do include de itens do contrato.
3. **Mapeamento do Nome dos Serviços no Dashboard:** Atualizado o mapeamento de itens do contrato no `ClientDashboardServiceImpl.ts` para recuperar o nome do serviço ou assinatura associado.
4. **Mapeamento da Data de Pagamento nas Faturas:** Corrigido o `ClientBillingServiceImpl.ts` para mapear corretamente o campo de data de pagamento da parcela utilizando `payment_date` ao invés de `paid_date`.
5. **Correção do Retorno de Faturas no Frontend:** Corrigido o caso de uso `ClientBillingServiceImpl.ts` no frontend (`app-arcadian`) para retornar diretamente o array de parcelas já tratado pelo repositório.

## Por Que (Por que foi implementado?)
- Clientes com tokens JWT gerados antes do onboarding/criação de perfil ou com sessões antigas sofriam com erros `401 Unauthorized` ao acessar a rota de projetos.
- O mapeamento incorreto do campo `payment_date` (antigo `paid_date`) e do retorno do frontend que verificava `response.success` (em um array cru) causava quebras e erros visuais ao renderizar as faturas do cliente.
- A falta das associações de serviços/assinaturas nos itens de contrato impedia que o nome das soluções contratadas aparecesse no modal de detalhes de contratos do cliente.

## Como (Como foi implementado?)
- **Backend:**
  - Inserido fallback condicional utilizando `ProfileSequelize.findOne` nos métodos `getClientProjects` e `addTaskAttachment`.
  - Adicionados os modelos `ServiceSequelize` e `SubscriptionSequelize` nas relações aninhadas dentro da propriedade `include` de `getActiveContractsWithInstallments`.
  - Ajustado o retorno nos mapas e serviços backend.
- **Frontend:**
  - Limpo o retorno do método `listAll()` no `ClientBillingServiceImpl.ts` de forma a repassar o retorno direto da API.

## Componentes Afetados
- `back-arcadian/src/usecases/client/projects/controller/ClientProjectController.ts`
- `back-arcadian/src/repositories/database/SequelizeClientDashboardRepository.ts`
- `back-arcadian/src/usecases/client/dashboard/service/ClientDashboardServiceImpl.ts`
- `back-arcadian/src/usecases/client/billing/service/ClientBillingServiceImpl.ts`
- `app-arcadian/app/api/usecases/client/billing/services/ClientBillingServiceImpl.ts`
