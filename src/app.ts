import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import notFound from "./app/middlewares/notFound";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/GlobalErrorhandler";
// import notFound from "./app/middlewares/notFound";

const app = express();

// app.use(
//   expressSession({
//     secret: envVars.EXPRESS_SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "server is running",
  });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
