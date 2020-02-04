import * as path from "path";
import cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import logger from "morgan";
import express from "express";
import rootRouter from "./routes/root";
import recipeRouter from "./recipes/routes";
import ingredientsRouter from './ingredients/routes';
import plannerRouter from './planner/routes';
import shoppingRouter from './shopping/routes';
import dotenv from 'dotenv';
import MongoClient from 'mongodb';
import { RecipeDB } from './recipes/model';

namespace Application {
  locals: {
    db: MongoClient.MongoClient
  }
}

declare global {
  namespace Express {
    interface Response {
      app: Application,
      locals: {
        savedData: RecipeDB
      }
    }
  }
}

class App {
  public app: express.Application;

  constructor() {
    this.dotENV();
    this.app = express();
    this.middleware();
    this.launchApp();
  }

  private dotENV(): void {
    dotenv.config();
  }
  
  private routes(db: MongoClient.Db): void {
    this.app.use("/recipes", new recipeRouter(db).router);
    this.app.use("/ingredients", new ingredientsRouter(db).router);
    this.app.use('/planner', new plannerRouter(db).router);
    this.app.use('/shopping', new shoppingRouter(db).router);
    this.app.use("/", rootRouter);
  }

  private middleware(): void {
    this.app.set("port", process.env.PORT || 3000);
    this.app.use(logger("dev"));
    this.app.use(express.json());
    this.app.use(bodyParser.json({limit: '10mb'}));
    this.app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, "public")));
    this.app.use((req, res, next)=> {
      res.header("Access-Control-Allow-Origin", "*");
      res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      if ('OPTIONS' == req.method) {
        res.sendStatus(200);
      } else {
        next();
      }
    })
  }

  private connectDB(): Promise<MongoClient.Db> {
    return MongoClient.connect('mongodb://127.0.0.1:27017').then(dbClient => dbClient.db('ktchn'));
  }

  private startDB(db: MongoClient.Db): void {
    db.createCollection('ingredients').then(collection => {
      collection.createIndex({
        name: 'text',
        variants: 'text'
      }, {
        //@ts-ignore
        weights: {
          name: 10,
          variants: 5
        }
      })
    });
    db.createCollection('recipes');
    db.createCollection('planner');
    db.createCollection('shopping').then(collection => {
      collection.findOne({}).then(shoppingCart => {
        if (!shoppingCart) {
          collection.insertOne({
            date: new Date(),
            items: []
          })
        }
      })
    });
  }

  private launchApp() {
    this.connectDB().then(db => {
      this.routes(db);
      this.startDB(db);
      const port = this.app.get("port");
      this.app.listen(port, '0.0.0.0', () => {
        console.log(
          ("App is runnnning at http://localhost:%d in %s mode"),
          port,
          this.app.get("env")
        );
        console.log("Press CTRL-C to stop");
      });
    }).catch(error => {
      console.log(`Error loading database: ${error}`)
    });
  }
}

export default new App().app;