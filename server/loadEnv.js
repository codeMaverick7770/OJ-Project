import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Required for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute path to .env file
const envPath = path.join(__dirname, '.env');

// Load it
dotenv.config({ path: envPath });

console.log('✅ Loaded .env from:', envPath);
