import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import connectDB from '../src/config/db.js';
import cloudinary from '../src/config/cloudinary.js';
import Product from '../src/models/Product.js';

const uploadAll = async () => {
  await connectDB();

  console.log('--- 1. Uploading Hero / Banners to Lumen_ECommerce/banners ---');
  const heroFiles = [
    'hero-bg.jpg',
    'hero-books.jpg',
    'hero-electronics.jpg',
    'hero-shoes.jpg',
    'hero-sports.jpg'
  ];

  const publicImagesDir = path.resolve('../frontend/public/images');
  for (const file of heroFiles) {
    const fullPath = path.join(publicImagesDir, file);
    if (fs.existsSync(fullPath)) {
      const publicId = file.replace(/\.[^/.]+$/, '');
      const res = await cloudinary.uploader.upload(fullPath, {
        folder: 'Lumen_ECommerce/banners',
        public_id: publicId,
        overwrite: true,
      });
      console.log(`✓ Banner ${file} -> ${res.secure_url}`);
    }
  }

  console.log('\n--- 2. Uploading Blog Images to Lumen_ECommerce/blog ---');
  const blogFiles = ['shoes-minimalist.jpg', 'tech-lifestyle.jpg'];
  const blogDir = path.join(publicImagesDir, 'blog');
  for (const file of blogFiles) {
    const fullPath = path.join(blogDir, file);
    if (fs.existsSync(fullPath)) {
      const publicId = file.replace(/\.[^/.]+$/, '');
      const res = await cloudinary.uploader.upload(fullPath, {
        folder: 'Lumen_ECommerce/blog',
        public_id: publicId,
        overwrite: true,
      });
      console.log(`✓ Blog ${file} -> ${res.secure_url}`);
    }
  }

  console.log('\n--- 3. Handling any remaining products with Wikimedia URLs ---');
  const allProds = await Product.find();
  for (const prod of allProds) {
    let updated = false;
    const newImages = [];
    for (let i = 0; i < prod.images.length; i++) {
      const img = prod.images[i];
      if (!img.includes('res.cloudinary.com')) {
        console.log(`Downloading non-cloudinary image for ${prod.name}: ${img}`);
        try {
          // Download with browser user-agent
          const resp = await axios.get(img, {
            responseType: 'arraybuffer',
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
          });
          const base64 = `data:image/jpeg;base64,${Buffer.from(resp.data).toString('base64')}`;
          const cleanName = prod.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
          const uploadRes = await cloudinary.uploader.upload(base64, {
            folder: 'Lumen_ECommerce/products',
            public_id: `${cleanName}_${prod._id.toString().slice(-4)}_${i + 1}`,
            overwrite: true,
          });
          newImages.push(uploadRes.secure_url);
          updated = true;
          console.log(`✓ Uploaded ${prod.name} -> ${uploadRes.secure_url}`);
        } catch (e) {
          console.error(`Failed to download/upload ${img}:`, e.message);
          newImages.push(img);
        }
      } else {
        newImages.push(img);
      }
    }
    if (updated) {
      prod.images = newImages;
      await prod.save();
      console.log(`Saved product ${prod.name}`);
    }
  }

  console.log('\n=============================================');
  console.log('✓ All website images are now on Cloudinary!');
  console.log('=============================================');
  process.exit(0);
};

uploadAll().catch(e => {
  console.error(e);
  process.exit(1);
});
