import express from 'express';
import { UserController } from '../usecases/admin/users/controller/UserController';
import { StatsController } from '../usecases/admin/stats/controller/StatsController';
import ListLogsController from '../usecases/admin/logs/controller/ListLogsController';
import ServiceController from '../usecases/admin/services/controller/ServiceController';
import ClientController from '../usecases/admin/clients/controller/ClientController';
import { ContractController } from '../usecases/admin/contracts/controller/ContractController';
import { BillingController } from '../usecases/admin/billing/controller/BillingController';
import AlertsController from '../usecases/admin/alerts/controller/AlertsController';
import TaskController from '../usecases/admin/tasks/controller/TaskController';
import ProjectController from '../usecases/admin/projects/controller/ProjectController';

const userController = new UserController();
const statsController = new StatsController();
const listLogsController = new ListLogsController();
const serviceController = new ServiceController();
const clientController = new ClientController();
const contractController = new ContractController();
const billingController = new BillingController();
const alertsController = new AlertsController();
const taskController = new TaskController();
const projectController = new ProjectController();

const AdminRouter = express.Router();

// Estatísticas e Logs
AdminRouter.get('/stats', statsController.handle.bind(statsController));
AdminRouter.get('/logs', listLogsController.handle.bind(listLogsController));

// Gerenciamento de Usuários
AdminRouter.post('/invite', userController.invite.bind(userController));
AdminRouter.post('/users', userController.create.bind(userController));
AdminRouter.get('/users', userController.list.bind(userController));
AdminRouter.patch('/users/:id', userController.update.bind(userController));
AdminRouter.delete('/users/:id', userController.delete.bind(userController));

// Gerenciamento de Clientes
AdminRouter.get('/clients', clientController.list.bind(clientController));
AdminRouter.post('/clients', clientController.create.bind(clientController));
AdminRouter.patch('/clients/:id', clientController.update.bind(clientController));
AdminRouter.delete('/clients/:id', clientController.delete.bind(clientController));

// Gerenciamento de Serviços
AdminRouter.get('/services', serviceController.list.bind(serviceController));
AdminRouter.post('/services', serviceController.create.bind(serviceController));
AdminRouter.patch('/services/:id', serviceController.update.bind(serviceController));
AdminRouter.delete('/services/:id', serviceController.delete.bind(serviceController));


// Gerenciamento de Assinaturas
AdminRouter.get('/subscriptions', serviceController.listSubscriptions.bind(serviceController));
AdminRouter.post('/subscriptions', serviceController.createSubscription.bind(serviceController));
AdminRouter.patch('/subscriptions/:id', serviceController.updateSubscription.bind(serviceController));
AdminRouter.delete('/subscriptions/:id', serviceController.deleteSubscription.bind(serviceController));

// Gerenciamento de Contratos (Vínculos Ativos)
AdminRouter.post('/contracts', contractController.create.bind(contractController));
AdminRouter.get('/contracts', contractController.list.bind(contractController));
AdminRouter.patch('/contracts/:id', contractController.update.bind(contractController));
AdminRouter.delete('/contracts/:id', contractController.delete.bind(contractController));

// Faturamento e Cobranças
AdminRouter.get('/billing', billingController.listAll.bind(billingController));
AdminRouter.get('/billing/contracts/:contractId/installments', billingController.getInstallments.bind(billingController));
AdminRouter.patch('/billing/installments/:id', billingController.updateStatus.bind(billingController));
AdminRouter.patch('/billing/contracts/:id/upfront', billingController.toggleUpfrontStatus.bind(billingController));
AdminRouter.post('/billing/installments/:id/charge', billingController.charge.bind(billingController));

// Alertas e Comunicações (Banners e Notificações)
AdminRouter.get('/banners', alertsController.listBanners.bind(alertsController));
AdminRouter.post('/banners', alertsController.createBanner.bind(alertsController));
AdminRouter.patch('/banners/:id', alertsController.updateBanner.bind(alertsController));
AdminRouter.delete('/banners/:id', alertsController.deleteBanner.bind(alertsController));

AdminRouter.get('/notifications', alertsController.listNotifications.bind(alertsController));
AdminRouter.post('/notifications', alertsController.createNotification.bind(alertsController));
AdminRouter.delete('/notifications/:id', alertsController.deleteNotification.bind(alertsController));

// Projetos
AdminRouter.get('/projects', projectController.list.bind(projectController));
AdminRouter.get('/projects/:id', projectController.getById.bind(projectController));
AdminRouter.post('/projects', projectController.create.bind(projectController));
AdminRouter.patch('/projects/:id', projectController.update.bind(projectController));
AdminRouter.delete('/projects/:id', projectController.delete.bind(projectController));

// Tasks
AdminRouter.get('/tasks', taskController.list.bind(taskController));
AdminRouter.get('/tasks/:id', taskController.getById.bind(taskController));
AdminRouter.post('/tasks', taskController.create.bind(taskController));
AdminRouter.patch('/tasks/:id', taskController.update.bind(taskController));
AdminRouter.delete('/tasks/:id', taskController.delete.bind(taskController));

export default AdminRouter;
