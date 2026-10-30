import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../src/config/db.js';
import cloudinary from '../src/config/cloudinary.js';
import Product from '../src/models/Product.js';
import Category from '../src/models/Category.js';

const organize = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected.');

    const products = await Product.find().populate('category');
    console.log(`Organizing ${products.length} products by category...`);

    const oldPublicIdsToDelete = [];

    for (const prod of products) {
      const catName = prod.category ? prod.category.name : 'general';
      const catSlug = catName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const targetFolder = `Lumen_ECommerce/products/${catSlug}`;

      let updated = false;
      const newImages = [];

      for (let idx = 0; idx < prod.images.length; idx++) {
        const img = prod.images[idx];

        // If already in the right subfolder, skip
        if (img.includes(`Lumen_ECommerce/products/${catSlug}/`)) {
          newImages.push(img);
          continue;
        }

        console.log(`[${catName}] Uploading ${prod.name} (img ${idx + 1})...`);
        try {
          const cleanName = prod.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
          const uploadRes = await cloudinary.uploader.upload(img, {
            folder: targetFolder,
            public_id: `${cleanName}_${prod._id.toString().slice(-4)}_${idx + 1}`,
            overwrite: true,
          });

          newImages.push(uploadRes.secure_url);
          updated = true;
          console.log(`✓ [${catName}] ${prod.name} -> ${uploadRes.secure_url}`);

          // Track old public id if it was directly under Lumen_ECommerce/products
          if (img.includes('Lumen_ECommerce/products/')) {
            const match = img.match(/Lumen_ECommerce\/products\/[^/.]+/);
            if (match && !match[0].includes(`/${catSlug}/`)) {
              oldPublicIdsToDelete.push(match[0]);
            }
          }
        } catch (err) {
          console.error(`✗ Error uploading ${prod.name}:`, err.message);
          newImages.push(img);
        }
      }

      if (updated) {
        prod.images = newImages;
        await prod.save();
        console.log(`Saved product ${prod.name}`);
      }
    }

    // Clean up old root product images that were moved into subfolders
    if (oldPublicIdsToDelete.length > 0) {
      console.log(`Cleaning up ${oldPublicIdsToDelete.length} old un-categorized images...`);
      for (const pid of oldPublicIdsToDelete) {
        try {
          await cloudinary.uploader.destroy(pid);
          console.log(`Deleted old: ${pid}`);
        } catch (e) {
          // ignore
        }
      }
    }

    console.log('\n======================================================');
    console.log('✓ All products organized into category-wise subfolders!');
    console.log('======================================================');
    process.exit(0);
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
};

organize();
