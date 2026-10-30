import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../src/config/db.js';
import cloudinary from '../src/config/cloudinary.js';
import Category from '../src/models/Category.js';
import Product from '../src/models/Product.js';

const migrate = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();

    console.log('\n--- 1. Migrating Categories to Lumen_ECommerce/categories ---');
    const categories = await Category.find();
    for (const cat of categories) {
      if (!cat.imageUrl) continue;

      if (cat.imageUrl.includes('res.cloudinary.com/r2abyx4h')) {
        console.log(`[Category] ${cat.name} already on Cloudinary. Skipping.`);
        continue;
      }

      console.log(`[Category] Uploading ${cat.name}...`);
      try {
        const cleanName = cat.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const uploadRes = await cloudinary.uploader.upload(cat.imageUrl, {
          folder: 'Lumen_ECommerce/categories',
          public_id: `${cleanName}_${cat._id.toString().slice(-4)}`,
          resource_type: 'auto',
          overwrite: true,
        });

        cat.imageUrl = uploadRes.secure_url;
        await cat.save();
        console.log(`[Category] ✓ ${cat.name} updated -> ${uploadRes.secure_url}`);
      } catch (err) {
        console.error(`[Category] ✗ Error uploading ${cat.name}:`, err.message);
      }
    }

    console.log('\n--- 2. Migrating Products to Lumen_ECommerce/products ---');
    const products = await Product.find();
    for (const prod of products) {
      if (!prod.images || prod.images.length === 0) continue;

      let updated = false;
      const newImages = [];

      for (let idx = 0; idx < prod.images.length; idx++) {
        const img = prod.images[idx];

        if (img.includes('res.cloudinary.com/r2abyx4h')) {
          newImages.push(img);
          continue;
        }

        console.log(`[Product] Uploading ${prod.name} (Image ${idx + 1}/${prod.images.length})...`);
        try {
          const cleanName = prod.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
          const uploadRes = await cloudinary.uploader.upload(img, {
            folder: 'Lumen_ECommerce/products',
            public_id: `${cleanName}_${prod._id.toString().slice(-4)}_${idx + 1}`,
            resource_type: 'auto',
            overwrite: true,
          });

          newImages.push(uploadRes.secure_url);
          updated = true;
          console.log(`[Product] ✓ ${prod.name} (Image ${idx + 1}) -> ${uploadRes.secure_url}`);
        } catch (err) {
          console.error(`[Product] ✗ Error uploading image ${idx + 1} for ${prod.name}:`, err.message);
          newImages.push(img); // keep original if failed
        }
      }

      if (updated) {
        prod.images = newImages;
        await prod.save();
        console.log(`[Product] Saved updated images for: ${prod.name}`);
      }
    }

    console.log('\n========================================');
    console.log('✓ Migration to Cloudinary completed successfully!');
    console.log('========================================');
    process.exit(0);
  } catch (error) {
    console.error('Fatal Migration Error:', error);
    process.exit(1);
  }
};

migrate();
