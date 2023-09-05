import {
  emailIsValid,
  passwordIsValid,
  hashAString,
  stringEqualsHash,
} from "../utils/index.js";
import { getUserByEmail } from "../utils/dbHelper.js";
import db from "../db.js";
import jwt from "jsonwebtoken";

const userCollection = db?.collection("user");

export const signUp = async (
  email: string,
  password: string
): Promise<void> => {
  if (!emailIsValid(email)) {
    throw "The email is not valid";
  }

  if (!passwordIsValid(password)) {
    throw "The password is not valid";
  }

  const findUserRes = await getUserByEmail(email);

  const userExists: boolean = findUserRes !== null;
  if (userExists) {
    throw "The user already exists";
  }

  const hashToPersist: string = hashAString(password);

  const createUserRes = await userCollection?.insertOne({
    email: email,
    password: hashToPersist,
  });

  if (createUserRes?.acknowledged) {
    return;
  }
  throw "An error occurred, the user was not saved";
};

export const signIn = async (
  email: string,
  password: string
): Promise<string> => {
  if (!emailIsValid(email)) {
    throw "The email is not valid";
  }

  if (!passwordIsValid(password)) {
    throw "The password is not valid";
  }

  const findUserRes = await getUserByEmail(email);

  const userDoesntExist: boolean = findUserRes === null;

  if (userDoesntExist) {
    throw "User doesn't exist";
  }

  if (!stringEqualsHash(password, findUserRes.password)) {
    throw "The credentials are not valid";
  }

  const tokenDurationInMinutes: number = 5;
  const token = jwt.sign(
    {
      exp: Date.now() + tokenDurationInMinutes * 60 * 1000,
      data: { email: email, password: findUserRes.password },
    },
    process.env.HASHING_SECRET || ""
  );

  return token;
};

export const getLoggedUser = async (email: string) => {
  const userRes = await getUserByEmail(email);

  return { ...userRes, password: undefined };
};

export const getUsersPaginated = async (limit: number, page: number) => {
  const paginationPipeline: any[] = [
    { $skip: limit * page },
    { $limit: limit },
  ];

  const agreggation = await userCollection?.aggregate(paginationPipeline);

  const usersList = await agreggation?.toArray();

  return usersList?.map((user) => ({ ...user, password: undefined }));
};
