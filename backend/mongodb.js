import mongoose from 'mongoose';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  UserModel,
  JobModel,
  ApplicationModel,
  PartnershipModel,
  DriveModel,
  StatsModel
} from './models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let isConnected = false;

export function isMongoDBActive() {
  return isConnected && mongoose.connection.readyState === 1;
}

export async function connectMongoDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('ℹ️ [MongoDB] MONGODB_URI not set in .env. Using fast local JSON database (zero-setup mode).');
    return false;
  }

  try {
    console.log('🔄 [MongoDB] Connecting to MongoDB...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log('✅ [MongoDB] Connected successfully to MongoDB database!');

    await seedFromLocalDatabaseIfEmpty();

    return true;
  } catch (err) {
    isConnected = false;
    console.warn(`⚠️ [MongoDB] Connection failed (${err.message}). Seamlessly falling back to local JSON database.`);
    return false;
  }
}

async function seedFromLocalDatabaseIfEmpty() {
  try {
    const userCount = await UserModel.countDocuments();
    if (userCount > 0) {
      return;
    }

    const localDbPath = path.resolve(__dirname, 'data', 'portal-database.json');
    if (!fs.existsSync(localDbPath)) {
      return;
    }

    const raw = fs.readFileSync(localDbPath, 'utf-8');
    const localData = JSON.parse(raw);

    console.log('🌱 [MongoDB] Seeding initial data from local JSON database to MongoDB...');

    if (localData.users && localData.users.length > 0) {
      await UserModel.insertMany(localData.users);
      console.log(`  ✓ Migrated ${localData.users.length} users to MongoDB`);
    }

    if (localData.jobs && localData.jobs.length > 0) {
      await JobModel.insertMany(localData.jobs);
      console.log(`  ✓ Migrated ${localData.jobs.length} jobs to MongoDB`);
    }

    if (localData.applications && localData.applications.length > 0) {
      await ApplicationModel.insertMany(localData.applications);
      console.log(`  ✓ Migrated ${localData.applications.length} applications to MongoDB`);
    }

    if (localData.partnerships && localData.partnerships.length > 0) {
      await PartnershipModel.insertMany(localData.partnerships);
      console.log(`  ✓ Migrated ${localData.partnerships.length} MoUs / partnerships to MongoDB`);
    }

    if (localData.drives && localData.drives.length > 0) {
      await DriveModel.insertMany(localData.drives);
      console.log(`  ✓ Migrated ${localData.drives.length} placement drives to MongoDB`);
    }

    if (localData.stats) {
      await StatsModel.findOneAndUpdate(
        { id: 'portal_stats' },
        { ...localData.stats, id: 'portal_stats' },
        { upsert: true }
      );
      console.log('  ✓ Initialized portal analytics in MongoDB');
    }

    console.log('🎉 [MongoDB] Initial data seeding complete!');
  } catch (err) {
    console.error('Failed to seed MongoDB from local JSON:', err);
  }
}
