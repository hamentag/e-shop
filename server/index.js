const {
  client,
  createTables,
  createTriggers,
  initTopBrands,
  createUser,
  createProduct,
  createSeller,
  deleteProduct,
  fetchUsers,
  fetchProducts,
  fetchTopBrands,
  fetchCart,
  addToCart,
  updateCart,
  deleteCartProduct,
  authenticate,
  findUserWithToken,
  fetchSingleProduct,
  createGuest,
  fetchGuest,
  fetchGuestCart,
  addToGuestCart,
  updateGuestCart,
  deleteGuestCartProduct,
  createOrder,
  fetchOrderCollections,
  fetchOrders,
  saveFileInfo,
  saveImageInfo,
  fetchFiles,
  addProductImage
} = require('./db');

const { uploadFile, getFileUrl, deleteFile } = require('./s3AWS.js')

//
require('dotenv').config()

//
const { data } = require('./data.js');

const express = require('express');
const app = express();
app.use(express.json());
const { faker } = require('@faker-js/faker');

const multer = require('multer')
const crypto = require('crypto')
const sharp = require('sharp')
const fs = require('fs')

//for deployment only
const path = require('path');
app.use('/assets', express.static(path.join(__dirname, '../client/dist/assets')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../client/dist/index.html')));

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const cors = require('cors')
app.use(
  cors({
    origin: [
      'https://hs-ecommerce.onrender.com',
      'https://hs-eshop.netlify.app',
      'http://localhost:3000',
      'http://localhost:5173'
    ],

    methods: ['GET', 'POST', 'PUT', 'DELETE'],

    credentials: true
  })
);

// Functions

//
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

//
const getFileUrls = async (files) => {
  return await Promise.all(files.map(async (file) => {
    const url = await getFileUrl(file.title);
    return { ...file, url }
  }));
}

//
const isLoggedIn = async (req, res, next) => {
  try {
    req.user = await findUserWithToken(req.headers.authorization);
    next();
  }
  catch (ex) {
    next(ex);
  }
};

//
app.post('/api/auth/login', async (req, res, next) => {
  try {
    res.send(await authenticate(req.body));
  }
  catch (ex) {
    next(ex);
  }
});


app.post('/api/auth/register', async (req, res, next) => {
  try {
    res.send(await createUser(req.body));
  }
  catch (ex) {
    next(ex);
  }
});

app.get('/api/auth/me', isLoggedIn, (req, res, next) => {
  try {
    res.send(req.user);
  }
  catch (ex) {
    next(ex);
  }
});


app.get('/api/users', async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  }
  catch (ex) {
    next(ex);
  }
});

// fetchOrders
app.get('/api/users/:id/orders', isLoggedIn, async (req, res, next) => {
  try {
    const orderCollections = await fetchOrderCollections(req.params.id)

    const detailedOrderCollections = await Promise.all(orderCollections.map(async (el) => {
      const detailedOrderCollection = await fetchOrders(req.params.id, el.order_collection_id)

      const updatedItems = await Promise.all(detailedOrderCollection.items.map(async (i) => {
        const url = await getFileUrl(i.image_title);

        return { ...i, url }
      }))
      detailedOrderCollection.items = updatedItems;
      return detailedOrderCollection
    }))

    // sorting order collections
    detailedOrderCollections.sort((a, b) => {
      const keyA = a.created_at;
      const keyB = b.created_at;
      return keyB - keyA; // descending order
    });

    res.send(detailedOrderCollections)
  }
  catch (ex) {
    next(ex);
  }
});

// fetchCart
app.get('/api/users/:id/cart', isLoggedIn, async (req, res, next) => {
  try {
    const dbCart = await fetchCart(req.params.id)

    // if(dbCart.length === 0){ return {cart_count: 0, products:[]}}

    const cart = { cart_count: 0, products: [] }
    const keysToCombine = ['user_id', 'tax', 'cart_count', 'subtotal', 'total', 'tax_rate']

    const products = await Promise.all(dbCart.map(async (itm, index) => {
      // img
      const product = {}

      Object.entries(itm).forEach(async ([key, value]) => {
        if (!keysToCombine.includes(key)) {
          product[key] = value;
        } else if (index === 0) {
          cart[key] = value;
        }
      });

      product.images = await getFileUrls(product.images)

      return product
    }));
    cart["products"] = products;

    res.send(cart);
  }
  catch (ex) {
    next(ex);
  }
});

// Add product to cart
app.post('/api/users/:id/cart', isLoggedIn, async (req, res, next) => {
  try {
    res.status(201).send(await addToCart({ user_id: req.params.id, product_id: req.body.product_id, qty: req.body.qty }));
  }
  catch (ex) {
    next(ex);
  }
});

// createOrder
app.post('/api/users/:id/orders', isLoggedIn, async (req, res, next) => {
  try {
    res.status(201).send(await createOrder({ user_id: req.params.id }));
  }
  catch (ex) {
    next(ex);
  }
});

app.put('/api/users/:id/cart', isLoggedIn, async (req, res, next) => {
  try {
    res.send(await updateCart({ user_id: req.params.id, product_id: req.body.product_id, qty: req.body.qty }));
  }
  catch (ex) {
    next(ex);
  }
});

app.delete('/api/users/:user_id/cart/:id', isLoggedIn, async (req, res, next) => {
  try {
    await deleteCartProduct({ user_id: req.params.user_id, id: req.params.id });
    res.sendStatus(204);
  }
  catch (ex) {
    next(ex);
  }
});

// Delete product
app.delete('/api/products/:id', async (req, res, next) => {
  try {
    const { deletedProduct, images } = await deleteProduct({ id: req.params.id });

    if (!deletedProduct) {
      return res.status(404).send({ error: 'Product not found' });
    }

    // Delete images from S3
    const deleteImagePromises = images.map(image =>
      deleteFile(image.title)
    );
    await Promise.all(deleteImagePromises);

    res.status(200).send({
      message: 'Product and associated images deleted successfully',
      deletedProduct,
    });
  } catch (err) {
    next(err);
  }
});

// get home images urls
app.get('/api/home-images', async (req, res, next) => {
  try {
    const results = await getFileUrls(data.home_images)
    res.send(results);
  }
  catch (ex) {
    next(ex);
  }
});

//
app.get('/api/products', async (req, res, next) => {
  try {
    const products = await fetchProducts();
    const results = await Promise.all(products.map(async (product) => {
      const imagesWithUrls = await getFileUrls(product.images)
      return { ...product, images: imagesWithUrls }
    })
    );

    res.send(results);
  }
  catch (ex) {
    next(ex);
  }
});

app.get('/api/products/:id', async (req, res, next) => {
  try {
    const singleProduct = await fetchSingleProduct(req.params.id);

    const imagesWithUrls = await getFileUrls(singleProduct.images)
    const result = { ...singleProduct, images: imagesWithUrls }

    res.send(result);
  }
  catch (ex) {
    next(ex);
  }
});


// Ensure 'uploads/' directory exists before using multer (prevents ENOENT error)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('uploads/ directory created automatically');
}


// Storage Configuration for multiple files
const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload2 = multer({ storage: storage2 });


//////////////////////////
// const { uploadFile, getFileUrl } = require('./s3AWS');

app.post('/api/users/:id/products', isLoggedIn, upload2.array('images', 10), async (req, res, next) => {
  try {
    // 1. Create product in DB
    const createProductResult = await createProduct({
      title: req.body.title,
      category: req.body.category,
      brand: req.body.brand,
      price: req.body.price,
      dimensions: req.body.dimensions,
      characteristics: req.body.characteristics,
      inventory: req.body.inventory,
      rate: req.body.rate
    });

    const product_id = createProductResult.id;
    const files = req.files;

    // 2. Upload images and save info
    const imageResults = await Promise.all(
      files.map(async (file, index) => {
        const resizedFilePath = `uploads/resized-${file.filename}`;
        await sharp(file.path)
          .resize({ width: 800, height: 600 })
          .toFile(resizedFilePath);

        const fileContent = fs.readFileSync(resizedFilePath);
        const fileName = generateFileName();
        const mimeType = file.mimetype;

        await uploadFile(fileContent, `eshop_images/${fileName}`, mimeType);

        const saveImageInfoResult = await saveImageInfo({
          fileName,
          caption: req.body.caption[index],
          is_showcase: req.body.is_showcase[index],
          product_id
        });

        const imageUrl = await getFileUrl(fileName);

        // Clean up local files
        fs.unlinkSync(resizedFilePath);
        fs.unlinkSync(file.path);

        return {
          title: fileName,
          caption: req.body.caption[index],
          is_showcase: req.body.is_showcase[index],
          url: imageUrl
        };
      })
    );

    // 3. Construct full product object
    const productToSend = {
      id: product_id,
      title: req.body.title,
      category: req.body.category,
      brand: req.body.brand,
      price: req.body.price,
      dimensions: req.body.dimensions,
      characteristics: req.body.characteristics,
      inventory: req.body.inventory,
      images: imageResults
    };

    // 4. Send response
    res.status(201).send(productToSend);

  } catch (ex) {
    next(ex);
  }
});




//// Guest section
//  create Guest
app.post('/api/guests/join', async (req, res, next) => {
  try {
    res.send(await createGuest());
  }
  catch (ex) {
    next(ex);
  }
});

// fetch GuestCart
app.get('/api/guests/:id/cart', async (req, res, next) => {
  try {
    // res.send(await fetchGuestCart(req.params.id));
    const dbCart = await fetchGuestCart(req.params.id)

    const cart = { cart_count: 0, products: [] }
    const keysToCombine = ['user_id', 'tax', 'cart_count', 'subtotal', 'total', 'tax_rate']

    const products = await Promise.all(dbCart.map(async (itm, index) => {
      // img
      const product = {}

      Object.entries(itm).forEach(async ([key, value]) => {
        if (!keysToCombine.includes(key)) {
          product[key] = value;
        } else if (index === 0) {
          cart[key] = value;
        }
      });

      product.images = await getFileUrls(product.images)

      return product
    }));
    cart["products"] = products;

    res.send(cart);
  }
  catch (ex) {
    next(ex);
  }
});

// addToGuestCart
app.post('/api/guests/:id/guest_cart', async (req, res, next) => {
  try {
    res.status(201).send(await addToGuestCart({ guest_id: req.params.id, product_id: req.body.product_id, qty: req.body.qty }));
  }
  catch (ex) {
    next(ex);
  }
});

// updateGuestCart
app.put('/api/guests/:id/cart', async (req, res, next) => {
  try {
    res.send(await updateGuestCart({ guest_id: req.params.id, product_id: req.body.product_id, qty: req.body.qty }));
  }
  catch (ex) {
    next(ex);
  }
});

// deleteGuestCartProduct
app.delete('/api/guests/:guest_id/cart/:id', async (req, res, next) => {
  try {
    await deleteGuestCartProduct({ guest_id: req.params.guest_id, id: req.params.id });
    res.sendStatus(204);
  }
  catch (ex) {
    next(ex);
  }
});

// fetchGuest
app.get('/api/guests/:id', async (req, res, next) => {
  try {
    res.send(await fetchGuest(req.params.id));
  }
  catch (ex) {
    next(ex);
  }
});


// Fetch top brands
app.get('/api/top-brands', async (req, res, next) => {
  try {
    const t = await fetchTopBrands();
    console.log(">> t = ", t)
    res.send(t);
    // res.send(await fetchTopBrands());
  }
  catch (ex) {
    next(ex);
  }
});


// Handle keep warm requests  
app.get('/api/keep-warm', (req, res, next) => {
  try {
    res.send('Keep warm request received');
  }
  catch (ex) {
    next(ex);
  }
});


//
app.post('/api/files', upload.single('image'), async (req, res, next) => {
  try {
    // resize image
    const fileBuffer = await sharp(req.file.buffer)
      .resize({ height: 1750, width: 980, fit: "contain" })
      .toBuffer()

    const fileName = `showcase images/${generateFileName()}`;

    await uploadFile(fileBuffer, fileName, req.file.mimetype)

    // save file info (name and caption) in database
    await saveFileInfo({ fileName: fileName, caption: req.body.caption });

    res.send({ fileName });
  }
  catch (ex) {
    next(ex);
  }
});


// Error-handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message ? err.message : err });
});


//// Handle all other routes and serve the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});


// init
const init = async () => {
  const port = process.env.PORT || 3000;

  console.log('⏳ Connecting to database...');
  await client.connect();
  console.log('connected to database');

  await createTables();
  console.log('tables created');

  await createTriggers();
  console.log('triggers created');


  //// Create init products
  data.products.forEach(async (product) => {
    const product_id = (await createProduct({
      title: product.title,
      category: product.category,
      brand: product.brand,
      price: product.price,
      dimensions: product.dimensions,
      characteristics: product.characteristics,
      inventory: product.inventory,
      rate: product.rate
    })).id;

    // store data in database 
    product.images.forEach(async (image, index) => {
      if (index !== 0) {
        await addProductImage(image.title, image.caption, product_id, false)
      }
      else {
        await addProductImage(image.title, image.caption, product_id, true)
      }
    });
  });

  // Initialize top_brands (run after populating the products table)
  await initTopBrands(); 

  // Create init users
  await Promise.all([
    createUser({
      firstname: 'Demo', lastname: 'DEMO',
      email: 'demo@example.com', phone: '6151328764', password: 'eshop',
      is_admin: false, is_engineer: false
    }),
    createUser({
      firstname: 'Yasir', lastname: 'Amentag',
      email: 'yasir@com', phone: '6291382734', password: 'yasir_pw',
      is_admin: true, is_engineer: false
    }),
    createUser({
      firstname: 'Wisam', lastname: 'Amentag',
      email: 'c@m', phone: '6291682722', password: 'tst',
      is_admin: true, is_engineer: true
    }),
  ]);


  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
};

// init();
init().catch((err) => {
  console.error('Error during server initialization:', err);
});
