import { MongoClient, Db } from "mongodb";
import "dotenv/config";

const connectionString = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.0wc2nmt.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(connectionString);

const DB_NAME: string = "user_backend_challenge";
let connection: MongoClient;
let db: Db;

try {
  connection = await client.connect();
  client.db(DB_NAME).command({ ping: 1 });

  db = connection?.db(DB_NAME);
  console.log(
    `Connected to a MongoDB Atlas instance, to the ${DB_NAME} database`
  );
} catch (e) {
  console.log("Error connecting to MongoDB Atlas instance");
  db = {} as Db;
}

export default db;
