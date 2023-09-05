import db from "../db.js";

export const getUserByEmail = async (email: string): Promise<any> => {
  return await db?.collection("user").findOne({ email: email });
};
