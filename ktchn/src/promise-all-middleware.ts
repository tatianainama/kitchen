import { Request, NextFunction, Response } from 'express';
import { promises } from 'fs';

export interface IMiddleware {
  (req: Request, res: Response, next: NextFunction): Promise<any>
}

const piddleware = (middlewares: IMiddleware[]) => (req: Request, res: Response, next: NextFunction): void => {
  middlewares.reduce((middlewaresChain, currentMiddleware) => {
    return middlewaresChain.then(x => currentMiddleware(req, res, next))
  }, Promise.resolve([])).then(results => { // results would be ever necessary ?  
    next();
  }).catch(error => next(error));
}

export default piddleware;