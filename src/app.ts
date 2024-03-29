import "reflect-metadata";
import "dotenv/config";

import cors from "cors";
import express, { NextFunction, Request, response, Response } from "express";

import "express-async-errors";
import swaggerUi from "swagger-ui-express";

import "./shared/container";

import upload from "./config/upload";
import createConnection from "./database";
import { AppError } from "./errors/AppError";
import rateLimiter from "./middlewares/rateLimiter";
import { router } from "./routes";
import swaggerFile from "./swagger.json";

createConnection();
const app = express();

app.use(rateLimiter);
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/avatar", express.static(`${upload.tmpFolder}/avatar`));
app.use("/cars", express.static(`${upload.tmpFolder}/cars`));

app.use(cors());
app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  return res.status(500).json({
    status: "error",
    message: `Internal server error - ${err.message}`,
  });
});

export { app };
