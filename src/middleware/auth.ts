import express, { Router, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getUserByEmail } from "../utils/dbHelper.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: () => void
) => {
  const token = req.headers.authorization?.split(" ")[1] || "";

  let decodedToken: JwtPayload;
  try {
    decodedToken = jwt.verify(
      token,
      process.env.HASHING_SECRET || ""
    ) as JwtPayload;
  } catch (error) {
    res.status(401).send({ error });
    return;
  }

  if (+(decodedToken.exp ?? 0) <= Date.now()) {
    res.status(401).send({ message: "The token expired" });
    return;
  }

  const user: any = await getUserByEmail(decodedToken.data.email);

  if (decodedToken.data?.password !== user.password) {
    res.status(401).send({ message: "The token is not valid" });
    return;
  }

  next();
};
