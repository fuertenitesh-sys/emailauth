import mongoose from 'mongoose';
import User from './src/models/User.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://fuertenitesh_db_user:gBJhWk3rVwnUhLZy@cluster0.yilyczr.mongodb.net/EmailAuthDB?appName=Cluster0')
  .then(async () => {
    const user = await User.findOne().sort({ createdAt: -1 });
    console.log('LATEST OTP IS:', user.verificationOTP);
    process.exit(0);
  });
