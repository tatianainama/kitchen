import { Router } from 'express';
import mongoService, { IMongoService } from '../mongo';
import MongoClient from 'mongodb';
import { chainP } from '../promise-all-middleware';
import { getWeekPlanner, completePlanner, compactPlanner, savePlan, saveWeekPlanner, validatePlanner } from './controller';

class PlannerRoutes {
  public router: Router;
  private PlannerDB: IMongoService;

  public constructor(db: MongoClient.Db) {
    this.router = Router();
    this.PlannerDB = mongoService(db)('planner');
    this.init();
  }

  private init() {
    this.router.get('/all/');
    this.router.get('/week/:week', chainP([getWeekPlanner(this.PlannerDB)]));
    this.router.get('/week/:week/complete', chainP([completePlanner(this.PlannerDB)]));
    this.router.get('/week/:week/compact', chainP([compactPlanner(this.PlannerDB)]));
    this.router.post('/week', chainP([validatePlanner(this.PlannerDB), saveWeekPlanner(this.PlannerDB)]));
    this.router.post('/day', chainP([savePlan(this.PlannerDB)]));
  }
}

export default PlannerRoutes;