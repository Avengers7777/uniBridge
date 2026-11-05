import app from '../backend/server.js';
import { connectMongoDB } from '../backend/mongodb.js';

let isMongoInit = false;

export default async function handler(req, res) {
  if (!isMongoInit) {
    try {
      await connectMongoDB();
    } catch (e) {
      console.warn('MongoDB connection in serverless function:', e);
    }
    isMongoInit = true;
  }
  return app(req, res);
}
