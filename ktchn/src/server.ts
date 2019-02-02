import * as path from "path";
import cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import logger from "morgan";
import express from "express";
import rootRouter from "./routes/root";
import recipeRouter from "./recipes/routes";
import nano from 'nano';
import dotenv from 'dotenv';

class App {
  public express: express.Application;
  public db: nano.DatabaseScope;

  constructor() {
    this.dotENV();
    this.express = express();
    this.middleware();
    this.routes();
    this.launchConf();
    this.db = this.couchDB();
  }

  private dotENV(): void {
    dotenv.config();
  }

  private couchDB(): nano.DatabaseScope {
    let db = nano(process.env.COUCHDB_URL || 'http://localhost:5984/').db;
    let recipes = db.use('recipes');
    return db;
  }
  private routes(): void {
    this.express.use("/recipes", recipeRouter);
    this.express.use("/", rootRouter);
  }

  private middleware(): void {
    this.express.set("port", process.env.PORT || 3000);
    this.express.use(logger("dev"));
    this.express.use(express.json());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(cookieParser());
    this.express.use(express.static(path.join(__dirname, "public")));
  }

  private launchConf() {
    const port = this.express.get("port");
    console.log('port', port);
    this.express.listen(port, () => {
      console.log(
        ("App is runnnning at http://localhost:%d in %s mode"),
        port,
        this.express.get("env")
      );
      console.log("Press CTRL-C to stop");
    });
  }
}

export default new App().express;