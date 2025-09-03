import mongoose from 'mongoose';

/**
 * Connects to the MongoDB database using the Mongoose library.
 * - Reads the connection URI from environment variables.
 * - Defaults to a local MongoDB instance if no URI is provided.
 */
export async function connectMongo(): Promise<void> {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/products';
  await mongoose.connect(uri);
}
