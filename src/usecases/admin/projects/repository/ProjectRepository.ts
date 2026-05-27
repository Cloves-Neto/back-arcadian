import { SequelizeProject } from '../../../../models/database/SequelizeProject';
import { SequelizeProjectStage } from '../../../../models/database/SequelizeProjectStage';
import { SequelizeProjectStep } from '../../../../models/database/SequelizeProjectStep';
import { TaskSequelize } from '../../../../models/database/SequelizeTask';
import { SequelizeTaskTodo } from '../../../../models/database/SequelizeTaskTodo';
import { ContractSequelize } from '../../../../models/database/SequelizeContract';
import { ClientSequelize } from '../../../../models/database/SequelizeClient';
import { ProfileSequelize } from '../../../../models/database/SequelizeProfile';
import { UserSequelize } from '../../../../models/database/SequelizeUser';

export default class ProjectRepository {
  public async create(data: any): Promise<SequelizeProject> {
    return SequelizeProject.create(data);
  }

  public async findAll(): Promise<SequelizeProject[]> {
    return SequelizeProject.findAll({
      include: [
        {
          model: ContractSequelize,
          as: 'contract',
          include: [{ 
            model: ClientSequelize, 
            as: 'client',
            include: [{
              model: ProfileSequelize,
              as: 'profile',
              include: [{ model: UserSequelize, as: 'user' }]
            }] 
          }]
        },
        {
          model: SequelizeProjectStage,
          include: [
            {
              model: SequelizeProjectStep,
              include: [TaskSequelize] // Optionally we could nest task_todos
            },
            {
              model: TaskSequelize
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });
  }

  public async findById(id: string): Promise<SequelizeProject | null> {
    return SequelizeProject.findByPk(id, {
      include: [
        {
          model: SequelizeProjectStage,
          include: [
            {
              model: SequelizeProjectStep
            },
            {
              model: TaskSequelize,
              include: [{ model: SequelizeTaskTodo }]
            }
          ]
        }
      ]
    });
  }

  public async update(id: string, data: any): Promise<SequelizeProject | null> {
    const project = await SequelizeProject.findByPk(id);
    if (!project) return null;
    return project.update(data);
  }

  public async delete(id: string): Promise<boolean> {
    const deleted = await SequelizeProject.destroy({ where: { id } });
    return deleted > 0;
  }
}
