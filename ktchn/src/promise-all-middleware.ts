import { Request, NextFunction, Response } from 'express';
import { promises } from 'fs';

export interface IMiddleware {
  (req: Request, res: Response, next: NextFunction): Promise<any>
}

export interface ChainedMiddleware {
  (req: Request, res: Response, next: NextFunction): (result: any) => Promise<any>
}

const piddleware = (middlewares: IMiddleware[]) => (req: Request, res: Response, next: NextFunction): void => {
  middlewares.reduce((middlewaresChain, currentMiddleware) => {
    return middlewaresChain.then(x => currentMiddleware(req, res, next))
  }, Promise.resolve([])).then(results => { // results would be ever necessary ?  
    next();
  }).catch(error => next(error));
}

const chainP = (middlewares: ChainedMiddleware[]) => (req: Request, res: Response, next: NextFunction): void => {
  middlewares.reduce(async (middlewaresChain, currentMiddleware) => {
    const result = await middlewaresChain;
    return await currentMiddleware(req, res, next)(result);
  }, Promise.resolve()).then(results => { // results would ever be necessary ?  
    res.json(results)
  }).catch(error => next(error));
}

export default piddleware;

export {
  chainP,
};