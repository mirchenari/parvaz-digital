import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let promiseClient;

if (!process.env.MONGODB_URI) {
  throw new Error("تنظیمات دیتابیس را چک کنید.");
}

if (process.env.NODE_ENV == "development") {
  if (!global._mongoCache) {
    client = new MongoClient(uri, options);
    global._mongoCache = client.connect();
  }
  promiseClient = global._mongoCache;
} else {
  client = new MongoClient(uri, options);
  promiseClient = client.connect();
}

export default promiseClient;