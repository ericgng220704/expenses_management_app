declare global {
  // Allow `global._mongoClientPromise` to be any type
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable to prevent multiple connections
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new connection each time
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
