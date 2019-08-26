import { Router } from 'express';
import mongoService, { IMongoService } from '../mongo';
import MongoClient from 'mongodb';
import { chainP } from '../promise-all-middleware';
import { getWeekPlanner, formatPlanner } from './controller';

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
    this.router.get('/week/:week', chainP([getWeekPlanner(this.PlannerDB)]))
    this.router.get('/week/:week/organized', chainP([formatPlanner(this.PlannerDB)]))
  }
}

export default PlannerRoutes;