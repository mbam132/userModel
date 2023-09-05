import express, { Router, Request, Response } from "express";
import { getUserByEmail } from "../utils/dbHelper.js";
import {
  signUp,
  signIn,
  getUsersPaginated,
  getLoggedUser,
} from "../controllers/user.js";
import { authMiddleware } from "../middleware/auth.js";
import jwt, { JwtPayload } from "jsonwebtoken";

const router: Router = express.Router();

router.post("/sign-up", async (req: Request, res: Response) => {
  try {
    await signUp(req.body.email, req.body.password);

    res.status(201).send({ message: "The user was created" });
  } catch (error) {
    res.status(400).send({ error });
  }
});

router.post("/sign-in", async (req: Request, res: Response) => {
  try {
    const token = await signIn(req.body.email, req.body.password);

    res.status(200).send({ jwt: token });
  } catch (error) {
    res.status(400).send({ error });
  }
});

router.use(authMiddleware);

router.post("/sign-out", (req: Request, res: Response) => {
  res.status(200).send({ message: "Sucessfuly logged out in the server" });
});

router.get("/get-logged-user", async (req: Request, res: Response) => {
  const authToken = req.headers.authorization?.split(" ")[1] || "";
  const decodedToken = jwt.verify(
    authToken,
    process.env.HASHING_SECRET || ""
  ) as JwtPayload;

  try {
    const user = await getLoggedUser(decodedToken.data.email);
    res.status(200).send({ user });
  } catch (error) {
    res.status(400).send({ error });
  }
});

router.get("/get-users", async (req: Request, res: Response) => {
  try {
    const users = await getUsersPaginated(+req.body.limit, +req.body.page);
    res.status(200).send({ users });
  } catch (error) {
    res.status(400).send({ error });
  }
});

export default router;
