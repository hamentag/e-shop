const {
  client,
  createTables,
  createTriggers,
  createUser, 
  createProduct,
  createSeller,
  deleteProduct,
  fetchUsers, 
  fetchProducts, 
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

const { uploadFile, getFileUrl }  = require('./s3AWS.js')  // deleteFile

//
require('dotenv').config()

//
const{ data } = require('./data.js');

const express = require('express');
const app = express();
app.use(express.json());
const { faker } = require('@faker-js/faker');

const multer = require('multer')
const crypto = require ('crypto')
const sharp = require('sharp')
const fs = require('fs')

//for deployment only
const path = require('path');
app.use('/assets', express.static(path.join(__dirname, '../client/dist/assets')));
app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '../client/dist/index.html')));

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
  return await Promise.all(files.map(async(file) => {
    const url = await getFileUrl(file.title);
    return { ...file, url}
  }));
}
//  
const isLoggedIn = async(req, res, next)=> {
  try {
    req.user = await findUserWithToken(req.headers.authorization);
    next();
  }
  catch(ex){
    next(ex);
  }
};


app.post('/api/auth/login', async(req, res, next)=> {
  try {
    res.send(await authenticate(req.body));
  }
  catch(ex){
    next(ex);
  }
});


app.post('/api/auth/register', async(req, res, next)=> {
  try {
    res.send(await createUser(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/auth/me', isLoggedIn, (req, res, next)=> {
  try {
    res.send(req.user);
  }
  catch(ex){
    next(ex);
  }
});


app.get('/api/users', async(req, res, next)=> {
  try {
    res.send(await fetchUsers());
  }
  catch(ex){
    next(ex);
  }
});

// fetchOrders
app.get('/api/users/:id/orders', isLoggedIn, async(req,res,next)=> {
  try{
    const orderCollections = await fetchOrderCollections(req.params.id)

    const detailedOrderCollections = await Promise.all(orderCollections.map(async(el)=> {
      const detailedOrderCollection = await fetchOrders(req.params.id, el.order_collection_id)
     
      const updatedItems = await Promise.all (detailedOrderCollection.items.map(async(i) => {
        const url = await getFileUrl(i.image_title);

        return { ...i, url}
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
  catch(ex){
    next(ex);
  }
});

// fetchCart
app.get('/api/users/:id/cart', isLoggedIn, async(req, res, next)=> {
  try {
    const dbCart =  await fetchCart(req.params.id)
  
    // if(dbCart.length === 0){ return {cart_count: 0, products:[]}}

    const cart = {cart_count: 0, products:[]}
    const keysToCombine= ['user_id', 'tax', 'cart_count', 'subtotal', 'total', 'tax_rate']
   
    const products = await Promise.all (dbCart.map(async(itm, index) => {
      // img
      const product = {}
          
      Object.entries(itm).forEach(async([key, value]) => {
       if (!keysToCombine.includes(key)){
        product[key] = value;
        } else if(index === 0){
          cart[key] = value;
        }
      });

      product.images = await getFileUrls(product.images)

      return product    
    }));
    cart["products"] = products;
    
    res.send(cart);
  }
  catch(ex){
    next(ex);
  }
});

// Add product to cart
app.post('/api/users/:id/cart',  isLoggedIn,async(req, res, next)=> {
  try {
    res.status(201).send(await addToCart({ user_id: req.params.id, product_id: req.body.product_id, qty: req.body.qty}));
  }
  catch(ex){
    next(ex);
  }
});

// createOrder
app.post('/api/users/:id/orders',  isLoggedIn,async(req, res, next)=> {
  try {
    res.status(201).send(await createOrder({ user_id: req.params.id}));
  }
  catch(ex){
    next(ex);
  }
});

app.put('/api/users/:id/cart',  isLoggedIn,async(req, res, next)=> {
  try {
    res.send(await updateCart({ user_id: req.params.id, product_id: req.body.product_id, qty: req.body.qty}));
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/api/users/:user_id/cart/:id', isLoggedIn, async(req, res, next)=> {
  try {
    await deleteCartProduct({user_id: req.params.user_id, id: req.params.id });
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/api/products/:id', async(req, res, next)=>{
  try{
    await deleteProduct({id: req.params.id});
    res.sendStatus(204);
  } catch(ex){
    next(ex);
  }
});


// 
app.get('/api/home-images', async(req, res, next)=> {
  try {
    const results =  await getFileUrls(data.home_images)
    res.send(results);
  }
  catch(ex){
    next(ex);
  }
});

//
app.get('/api/products', async(req, res, next)=> {
  try {
    const products = await fetchProducts();
    const results = await Promise.all(products.map(async(product) => { 
      const imagesWithUrls = await getFileUrls(product.images)
      return { ...product, images: imagesWithUrls}
    })
    );
    
    res.send(results);
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/products/:id', async(req, res, next)=> {
  try {
    const singleProduct = await fetchSingleProduct(req.params.id );

    const imagesWithUrls = await getFileUrls(singleProduct.images)
    const result = { ...singleProduct, images: imagesWithUrls} 
  
    res.send(result);  
  }
  catch(ex){
    next(ex);
  }
});

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

// Add new product: Create new product, upload its images to s3, and save images' info

app.post('/api/users/:id/products', isLoggedIn,  upload2.array('images', 10), async(req, res, next)=> {
  try {
    
    // Create product on database
    const createProductResult = await createProduct({title: req.body.title, category: req.body.category, 
      brand: req.body.brand, price: req.body.price, dimensions: req.body.dimensions, 
      characteristics: req.body.characteristics, inventory: req.body.inventory});

    const files = req.files;

    // Resize images
    const addNewProductPromises = files.map(async (file, index) => {
      const resizedFilePath = `uploads/resized-${file.filename}`;
      await sharp(file.path)
          .resize({ width: 800, height: 600 })
          .toFile(resizedFilePath);

      // upload files to S3
      const fileContent = fs.readFileSync(resizedFilePath);

      const fileName = generateFileName();

      const uploadResult = await uploadFile(fileContent,  `eshop_images/${fileName}`, file.mimetype) // await uploadFileToS3(resizedFilePath, `resized-${file.filename}`);

      // save image info on database  
      const saveImageInfoResult = await saveImageInfo({fileName: fileName, caption: req.body.caption[index], is_showcase: req.body.is_showcase[index], product_id: createProductResult.id});

      // Clean up local resized file and original file
      fs.unlinkSync(resizedFilePath);
      fs.unlinkSync(file.path); 

      return {uploadResult, saveImageInfoResult};
  });

  const addNewProductResults = await Promise.all(addNewProductPromises);

   // Clean up original files
   // files.forEach(file => fs.unlinkSync(file.path));

   // Send a response
   res.status(200).send({
      message: 'Product created successfully',
      files: addNewProductResults
   });
   
  }
  catch(ex){
    next(ex);
  }
});

//// Guest section
//  create Guest
app.post('/api/guests/join', async(req, res, next)=> { 
  try {
    res.send(await createGuest());
  }
  catch(ex){
    next(ex);
  }
});

// fetch GuestCart
app.get('/api/guests/:id/cart', async(req, res, next)=> {
  try {
    // res.send(await fetchGuestCart(req.params.id));
    const dbCart =  await fetchGuestCart(req.params.id)
  
    const cart = {cart_count: 0, products:[]}
    const keysToCombine= ['user_id', 'tax', 'cart_count', 'subtotal', 'total', 'tax_rate']
   
    const products = await Promise.all (dbCart.map(async(itm, index) => {
      // img
    const product = {}
          
      Object.entries(itm).forEach(async([key, value]) => {
       if (!keysToCombine.includes(key)){
        product[key] = value;
        } else if(index === 0){
          cart[key] = value;
        }
      });

      product.images = await getFileUrls(product.images)

      return product    
    }));
    cart["products"] = products;  
    
    res.send(cart);
  }
  catch(ex){
    next(ex);
  }
});

  // addToGuestCart
  app.post('/api/guests/:id/guest_cart',async(req, res, next)=> {
    try {
      res.status(201).send(await addToGuestCart({ guest_id: req.params.id, product_id: req.body.product_id, qty: req.body.qty}));
    }
    catch(ex){
      next(ex);
    }
  });

  // updateGuestCart
  app.put('/api/guests/:id/cart',async(req, res, next)=> {
    try {
      res.send(await updateGuestCart({ guest_id: req.params.id, product_id: req.body.product_id, qty: req.body.qty}));
    }
    catch(ex){
      next(ex);
    }
  });

  // deleteGuestCartProduct
app.delete('/api/guests/:guest_id/cart/:id', async(req, res, next)=> {
  try {
    await deleteGuestCartProduct({guest_id: req.params.guest_id, id: req.params.id });
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
});

// fetchGuest
app.get('/api/guests/:id', async(req, res, next)=> {
  try {
    res.send(await fetchGuest(req.params.id ));
  }
  catch(ex){
    next(ex);
  }
}); 


// Handle keep warm requests  
app.get('/api/keep-warm', (req, res, next)=> {
  try {
    res.send('Keep warm request received');
  }
  catch(ex){
    next(ex);
  }
});

async function keepWarmRequest() {
  try {
    const response = await fetch('https://hs-ecommerce-srv.onrender.com/api/keep-warm');
    if (!response.ok) {
      throw new Error('Failed to send keep warm request');
    }
    console.log('Keep warm request sent successfully');
  } catch (error) {
    console.error('Error sending keep warm request:', error);
  }
}


//
app.post('/api/files' ,  upload.single('image'), async(req, res, next)=> {
  try {
    // resize image
    const fileBuffer = await sharp(req.file.buffer)
    .resize({ height: 1750, width: 980, fit: "contain" })
    .toBuffer()

    const fileName = `showcase images/${generateFileName()}`;

    await uploadFile(fileBuffer, fileName, req.file.mimetype)

    // save file info (name and caption) in database
    await saveFileInfo({fileName: fileName, caption:req.body.caption});

    res.send({fileName});
  }
  catch(ex){
    next(ex);
  }
});


// Error-handling middleware
app.use((err, req, res, next)=> {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message ? err.message : err });
});


//// Handle all other routes and serve the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});


// init
const init = async()=> {
  const port = process.env.PORT || 3000;
  await client.connect();
  console.log('connected to database');

  await createTables();
  console.log('tables created');

  await createTriggers();
  console.log('triggers created');

  //
  const createRandUser = () => {
    return  createUser({
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: faker.internet.email(),
      
      phone: faker.phone.number(),
      password: faker.internet.password({ length: 15 }),
      is_admin: faker.datatype.boolean(0.1),
      is_engineer: faker.datatype.boolean(0.1)
      }) 
  };
  const createRandProduct = () => {
    return createProduct({
      title: faker.commerce.productName(), 
      category: faker.commerce.product(),  
      brand: faker.commerce.product(),  
      price: faker.number.float({ min: 30, max: 1500, fractionDigits: 2}), 
      dimensions: `${faker.number.float({ min: 1, max: 25, fractionDigits: 1})} x ${faker.number.float({ min: 1, max: 25, fractionDigits: 1})} x ${faker.number.float({ min: 1, max: 25, fractionDigits: 1})}`, //6.1 x 3.0 x 1.4
      characteristics: faker.commerce.productDescription(), 
      inventory: faker.number.int({ min: 2, max: 30})
    }) 
  };
  
  //
  const numUsers = 10;
  const numProducts = 300; 
  const usersDummyDataFaker = await Promise.all(Array.from({length: numUsers}, createRandUser));
  // const productsDummyDataFaker = await Promise.all(Array.from({length: numProducts}, createRandProduct));

  // //
  data.products.forEach(async(product) => {
    const product_id = (await createProduct({
      title: product.title,
      category: product.category,
      brand: product.brand,
      price: product.price,
      dimensions: product.dimensions,
      characteristics: product.characteristics,
      inventory: product.inventory
    })).id;
    
    // store data in database 
    product.images.forEach( async(image, index) => {
      if(index !== 0){
        await addProductImage(image.title, image.caption, product_id, false)
      }
      else{
        await addProductImage(image.title, image.caption, product_id, true)
      }
    });
  });

  //
  const usersDummyData = await Promise.all([
    createUser({firstname: 'Demo', lastname: 'DEMO', 
                email:'demo@example.com', phone: '6151328764', password: 'eshop', 
                is_admin: false, is_engineer: false}),
    createUser({firstname: 'Yasir', lastname: 'Amentag', 
                email:'yasir@com', phone: '6291382734', password: 'yasir_pw', 
                is_admin: true, is_engineer: false}),
    ]);

  // console.log(await fetchUsers());
  // console.log(await fetchProducts());

  // console.log(await fetchCart(usersDummyData[0].id));
  // const testCart = await addToCart({ user_id: usersDummyData[0].id, product_id: productsDummyDataFaker[4].id, qty: 2 });
  // const testCart2 = await addToCart({ user_id: usersDummyData[0].id, product_id: productsDummyDataFaker[6].id, qty: 1 });
  // console.log("Adam's cart:",testCart);
  // console.log("fetchCart: ", await fetchCart(usersDummyData[0].id));

  app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
    keepWarmRequest();
    setInterval(keepWarmRequest, 300000);
  });
};

init();
