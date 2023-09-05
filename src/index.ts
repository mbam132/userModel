import express, { Express, Request, Response } from "express";
import userRouter from "./routes/user.js";
import bodyParser from "body-parser";
import "dotenv/config";

const port = process.env.PORT || 3001;
const app: Express = express();

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the User Model Rest Api");
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});

app.use("/auth", userRouter);
