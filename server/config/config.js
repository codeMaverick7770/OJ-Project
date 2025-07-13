import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envFile =
  process.env.NODE_ENV === 'production'
    ? path.join(__dirname, '../.env.production')
    : path.join(__dirname, '../.env');

dotenv.config({ path: envFile });

export const JWT_SECRET = process.env.JWT_SECRET;
export const MONGO_URI = process.env.MONGO_URI;
export const PORT = process.env.PORT || 8000;
