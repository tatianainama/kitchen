import * as path from "path";
import cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import logger from "morgan";
import express from "express";
import rootRouter from "./routes/root";
import recipeRouter from "./recipes/routes";
import nano from 'nano';
import dotenv from 'dotenv';
import MongoClient from 'mongodb';

class App {
  public app: express.Application;

  constructor() {
    this.dotENV();
    this.app = express();
    this.middleware();
    this.routes();
    this.launchConf();
  }

  private dotENV(): void {
    dotenv.config();
  }
  
  private routes(): void {
    this.app.use("/recipes", recipeRouter);
    this.app.use("/", rootRouter);
  }

  private middleware(): void {
    this.app.set("port", process.env.PORT || 3000);
    this.app.use(logger("dev"));
    this.app.use(express.json());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, "public")));
  }

  private launchMongoDb(): Promise<MongoClient.MongoClient> {
    return MongoClient.connect('mongodb://127.0.0.1:27017/api');
  }

  private launchConf() {
    this.launchMongoDb().then(dbClient => {
      this.app.locals.db = dbClient;
      const port = this.app.get("port");
      this.app.listen(port, () => {
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