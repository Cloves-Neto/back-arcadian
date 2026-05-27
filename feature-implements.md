# Checklist de Integração Frontend <-> Backend

Este documento serve como um guia iterativo (loop) para integrarmos os componentes e funcionalidades do frontend (`app-arcadian`) com as rotas do backend (`back-arcadian`). 

Sempre que concluirmos uma tarefa, marcaremos o checkbox `[x]` e avançaremos para o próximo item, até que a integração total esteja validada e todas as pontas (dados faltando) sejam resolvidas.

---

> ⚠️ **REGRA DE OURO (NÃO ALUCINAR)** ⚠️
> Durante TODA a execução deste checklist em loop, é estritamente obrigatório consultar os documentos e padrões presentes na pasta `.agents/` tanto do Frontend (`app-arcadian`) quanto do Backend (`back-arcadian`). 
> - No Frontend: Seguir rigidamente a Arquitetura OOP (Routes -> Controller -> Service -> Repository) estipulada em `.agents/skills/architecture/requisition-model-api.md`.
> - Sem invenções: Tudo deve ser implementado de acordo com a documentação estabelecida para garantir coerência.

---

## 🟢 Estágio 1: Autenticação e Conta
- [x] **1.1. Login e Sessão**
  - **Front**: Componentes em `features/auth`
  - **Back**: `AuthRouter.ts` (Login, Validação de Token, Senha)
  - **Ação**: Validar conexão inicial, envio do JWT e redirecionamento.
- [x] **1.2. Perfil do Usuário**
  - **Front**: Componentes em `features/profile` e `features/settings`
  - **Back**: `UserRouter.ts` (Busca de perfil e atualizações)
  - **Ação**: Garantir que as informações renderizadas na interface reflitam o que a API devolve (incluindo avatar e dados extras).

## 🔵 Estágio 2: Core Administrativo (Admin)
- [x] **2.1. Dashboard (Estatísticas)**
  - **Front**: Componentes em `features/dashboard`
  - **Back**: `AdminRouter.ts` (Endpoint de Stats)
  - **Ação**: Verificar se todos os totais e dados de gráficos batem com o esperado.
- [x] **2.2. Gestão de Clientes**
  - **Front**: Componentes em `features/clients` (Tabelas, Modais)
  - **Back**: `AdminRouter.ts` (CRUD de clientes)
  - **Ação**: Mapear se a API devolve redes sociais, links e endereços conforme a atualização recente de UI do front. (Implementar no back caso falte).
- [x] **2.3. Gestão de Contratos**
  - **Front**: Componentes em `features/contracts`
  - **Back**: `AdminRouter.ts` (CRUD de Contratos)
  - **Ação**: Validar as ligações de contratos com os clientes.
- [x] **2.4. Faturamento e Cobranças (Billing)**
  - **Front**: Componentes em `features/billing`
  - **Back**: `AdminRouter.ts` (Geração de parcelas e status)
  - **Ação**: Confirmar integração de baixa manual, envio de faturas via email (Resend) e status da parcela.

## 🟡 Estágio 3: Portal do Cliente (Área Externa)
- [ ] **3.1. Autenticação e Acesso do Cliente**
  - **Front**: Componentes em `features/client`
  - **Back**: `ClientRouter.ts` (Token mágico / Acesso)
  - **Ação**: Validar o fluxo de acesso isolado.
- [ ] **3.2. Catálogo e Visão de Projetos**
  - **Front**: Componentes em `features/catalog` e `features/client`
  - **Back**: `ClientRouter.ts`
  - **Ação**: Renderizar a tela de faturas do cliente sem erro de rota e garantindo que ele não possa ver dados administrativos.

## 🟣 Estágio 4: Funcionalidades Secundárias (A Implementar/Ajustar)
- [ ] **4.1. Projetos, Tasks e Equipe**
  - **Front**: `features/projects`, `features/team`
  - **Back**: Avaliar necessidade de criação de novos endpoints e controllers.
- [ ] **4.2. Logs de Auditoria**
  - **Front**: `features/logs`
  - **Back**: `AdminRouter.ts` (Verificar paginação e filtros).
- [ ] **4.3. Notificações**
  - **Front**: `features/notifications`
  - **Back**: Conferir suporte ou implementar base.
- [ ] **4.4. Páginas Legais**
  - **Front**: `features/legal`
  - **Back**: Endpoints abertos para busca dos termos.

---
*Este documento será modificado ativamente durante nosso processo de integração.*
