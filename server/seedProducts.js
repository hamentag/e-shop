//
const { data } = require('./data.js');
const { client, createProduct, addProductImage } = require('./db.js');
const { v4: uuidv4 } = require('uuid');

const { findCategoryByName, createCategory } = require('./db/queries/category.js')
const { linkProductToCategory } = require('./db/queries/productCategory.js');

// Check if "--force" flag was passed in CLI
const FORCE = process.argv.includes('--force');

const seedProducts = async () => {
  try {

    // Prevent re-seeding unless forced
    const result = await client.query('SELECT COUNT(*)::int AS count FROM products');
    if (result.rows[0].count > 0 && !FORCE) {
      console.log('Skipping seed: products already exist. Use "--force" to override.');
      process.exit(0);
    }

    // Begin transaction for atomic safety
    await client.query('BEGIN');

    const categoryNameToId = {};

    for (const product of data.products) {
      const categoryIds = [];

      // Create or reuse categories
      for (const categoryName of product.category) {
        const key = categoryName.toLowerCase();
        let categoryId = categoryNameToId[key];

        if (!categoryId) {
          const existing = await findCategoryByName(key);
          if (existing) {
            categoryId = existing.id;
          } else {
            const inserted = await createCategory(uuidv4(), categoryName);
            categoryId = inserted.id;
          }
          categoryNameToId[key] = categoryId;
        }

        categoryIds.push(categoryId);
      }

      // Insert product
      const productId = uuidv4();
      await createProduct({
        id: productId,
        title: product.title,
        brand: product.brand,
        price: product.price,
        dimensions: product.dimensions,
        characteristics: product.characteristics,
        inventory: product.inventory,
        rate: product.rate
      });

      // Link product to categories
      for (const categoryId of categoryIds) {
        await linkProductToCategory(productId, categoryId);
      }

      // Insert product images
      if (Array.isArray(product.images)) {
        for (let i = 0; i < product.images.length; i++) {
          const image = product.images[i];
          await addProductImage(image.title, image.caption, productId, i === 0);
        }
      }

      // console.log(`Seeded product: ${product.title}`);
    }

    await client.query('COMMIT');
    console.log('Seeding complete successfully.');
    // await client.end();
  } catch (err) {
    console.error('Seeding failed:', err);
    try {
      await client.query('ROLLBACK');
      console.error('Rolled back changes due to error.');
    } catch (rollbackErr) {
      console.error('Rollback failed:', rollbackErr);
    }
    process.exit(1);
  }
};

module.exports = {seedProducts}


// Run via CLI directly
if (require.main === module) {
  (async () => {
    try {
      await client.connect();
      await seedProducts();
      await client.end();
    } catch (err) {
      console.error('Seeding failed:', err);
      process.exit(1);
    }
  })();
}

