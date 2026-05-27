import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { ClientDashboardController } from '../usecases/client/dashboard/controller/ClientDashboardController';
import { ClientProfileController } from '../usecases/client/profile/controller/ClientProfileController';
import { ClientContractController } from '../usecases/client/contracts/controller/ClientContractController';
import { ClientBillingController } from '../usecases/client/billing/controller/ClientBillingController';
import ClientProjectController from '../usecases/client/projects/controller/ClientProjectController';

const router = Router();
const dashboardController = new ClientDashboardController();
const clientProfileController = new ClientProfileController();
const clientContractController = new ClientContractController();
const clientBillingController = new ClientBillingController();
const clientProjectController = new ClientProjectController();

// GET /api/v1/client/dashboard
// Returns comprehensive dashboard data for the authenticated client
router.get('/client/dashboard', authMiddleware, (req: any, res) => dashboardController.handle(req, res));

// GET /api/v1/client/profile
router.get('/client/profile', authMiddleware, clientProfileController.get.bind(clientProfileController));

// PUT /api/v1/client/profile
router.put('/client/profile', authMiddleware, clientProfileController.update.bind(clientProfileController));

// GET /api/v1/client/contracts
router.get('/client/contracts', authMiddleware, clientContractController.list.bind(clientContractController));

// GET /api/v1/client/billing
router.get('/client/billing', authMiddleware, clientBillingController.list.bind(clientBillingController));

// GET /api/v1/client/projects
router.get('/client/projects', authMiddleware, clientProjectController.getClientProjects.bind(clientProjectController));

// PATCH /api/v1/client/tasks/:taskId/attachments
router.patch('/client/tasks/:taskId/attachments', authMiddleware, clientProjectController.addTaskAttachment.bind(clientProjectController));

export default router;
