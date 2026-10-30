import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'r2abyx4h',
  api_key: process.env.CLOUDINARY_API_KEY || '526278519741352',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'VHHgtA-TCJlA3cyW03stz_mPnHM',
});

export default cloudinary;
