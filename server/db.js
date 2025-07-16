
const pg = require('pg');
// const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/eCommerce_site_db');

const { Client } = require('pg');  

require('dotenv').config()

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,// 5432  // Default PostgreSQL port
});

const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT || 'shhh';

const TAX_RATE = 6.5;

const createTables = async()=> {
  const SQL = `
    -- Create tables:
    DROP TABLE IF EXISTS users cascade;
    DROP TABLE IF EXISTS products cascade;
    DROP TABLE IF EXISTS cart cascade;
    DROP TABLE IF EXISTS orders CASCADE;
    DROP TABLE IF EXISTS guests cascade;
    DROP TABLE IF EXISTS guest_cart cascade;
    DROP TABLE IF EXISTS files cascade;
    DROP TABLE IF EXISTS images cascade;
    DROP TABLE IF EXISTS sellers cascade;
    DROP TABLE IF EXISTS stores cascade;
    
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE users(
      id UUID PRIMARY KEY,
      firstname VARCHAR(40) NOT NULL,
      lastname VARCHAR(40) NOT NULL,
      email VARCHAR(155) UNIQUE NOT NULL,
      password VARCHAR(155) NOT NULL,
      phone VARCHAR(25),
      avatar VARCHAR(500),
      has_avatar BOOLEAN DEFAULT false,
      is_admin BOOLEAN DEFAULT false,
      is_engineer BOOLEAN DEFAULT false
    );
    CREATE TABLE products(
      id UUID PRIMARY KEY,
      title VARCHAR(60) NOT NULL,
      category VARCHAR(45) NOT NULL,
      brand VARCHAR(45) NOT NULL,
      price NUMERIC NOT NULL,
      dimensions VARCHAR(45) NOT NULL,
      characteristics VARCHAR(255) NOT NULL,
      inventory INTEGER NOT NULL
    );
    CREATE TABLE cart(
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) NOT NULL,
      product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
      qty INTEGER,
      CONSTRAINT unique_user_id_and_product_id_un UNIQUE (user_id, product_id) 
    );
  
    CREATE TABLE orders(
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) NOT NULL,
      product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
      qty INTEGER,
      order_collection_id UUID,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()        
    );
    CREATE TABLE guests(
      id UUID PRIMARY KEY
    );
    CREATE TABLE guest_cart(
      id UUID PRIMARY KEY,
      guest_id UUID REFERENCES guests(id) NOT NULL,
      product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
      qty INTEGER,
      CONSTRAINT unique_guest_id_and_product_id UNIQUE (guest_id, product_id)
    );
    CREATE TABLE files(
      id UUID PRIMARY KEY,
      filename VARCHAR(70) NOT NULL,
      caption VARCHAR(80) NOT NULL
    );
    CREATE TABLE images(
      id UUID PRIMARY KEY,
      title VARCHAR(120) NOT NULL,
      caption VARCHAR(80),
      product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
      is_showcase BOOLEAN DEFAULT false
    );
    CREATE TABLE sellers(
      user_id UUID REFERENCES users(id) NOT NULL,
      rate NUMERIC
    );
    CREATE TABLE stores(
      user_id UUID REFERENCES users(id) NOT NULL,
      product_id UUID REFERENCES products(id) ON DELETE CASCADE
    );
  `;
  await client.query(SQL);
};

// create Triggers
const createTriggers = async()=> {
  // Reduce inventory when order is created
  let SQL = `
    CREATE OR REPLACE FUNCTION reduce_inventory_when_place_order()
    RETURNS TRIGGER AS $$
    BEGIN
        UPDATE products
        SET inventory = inventory - NEW.qty
        WHERE id = NEW.product_id;        
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Create trigger to clear cart when order is created
    CREATE TRIGGER reduce_inventory_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION reduce_inventory_when_place_order();
  `;
  await client.query(SQL);

  // -- Update cart ceiling quantity when order is created
  SQL = `
    CREATE OR REPLACE FUNCTION update_cart_qty_ceiling()  
    RETURNS TRIGGER AS $$
    DECLARE
      matched_row RECORD;
    BEGIN 
      FOR matched_row IN SELECT * FROM cart WHERE NEW.id = cart.product_id AND NEW.inventory < cart.qty LOOP
        matched_row.qty := NEW.inventory;
        IF matched_row.qty = 0 THEN
          DELETE FROM cart WHERE id = matched_row.id;
        ELSE
          -- Update the cart table with the new quantity
          UPDATE cart SET qty = matched_row.qty WHERE id = matched_row.id;
        END IF;
      END LOOP;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Create trigger to clear cart when order is created
    CREATE TRIGGER qty_ceiling_trigger
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_cart_qty_ceiling();
  `;
  await client.query(SQL);

  // Check constraint function to validate data before insert or update the cart quantity
  SQL = `
    CREATE OR REPLACE FUNCTION check_cart_quantity_less_than_inventory()

    RETURNS TRIGGER AS $$
    BEGIN
        IF (SELECT inventory FROM products WHERE id = NEW.product_id) < NEW.qty THEN
            RAISE EXCEPTION 'Oops! It seems you have added more items to your cart than we have in stock.';
        END IF;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Create trigger to execute check constraint function (case logged in user cart)
    CREATE TRIGGER check_cart_quantity_trigger
    BEFORE INSERT OR UPDATE ON cart
    FOR EACH ROW
    EXECUTE FUNCTION check_cart_quantity_less_than_inventory();

    -- Create trigger to execute check constraint function (case guest cart)
    CREATE TRIGGER check_cart_quantity_trigger
    BEFORE INSERT OR UPDATE ON guest_cart
    FOR EACH ROW
    EXECUTE FUNCTION check_cart_quantity_less_than_inventory();
  `;
  await client.query(SQL);

  //  Clear cart when order is created
  SQL = `
  CREATE OR REPLACE FUNCTION clear_cart_when_place_order()
  RETURNS TRIGGER AS $$
  BEGIN
      DELETE FROM cart WHERE user_id = NEW.user_id AND product_id = NEW.product_id;
      RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  -- Create trigger to clear cart when order is created
  CREATE TRIGGER clear_cart_trigger
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION clear_cart_when_place_order();
  `;
  await client.query(SQL);
};


// create new user
const createUser = async({ firstname, lastname, email, phone, password, is_admin, is_engineer})=> {
  const SQL = `
    INSERT INTO users(id, firstname, lastname, email, phone, password, is_admin, is_engineer) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), firstname, lastname, email, phone, await bcrypt.hash(password, 5), is_admin, is_engineer]);
  return response.rows[0];
};

// create new product
const createProduct = async({ title, category, brand, price, dimensions, characteristics, inventory })=> {
  const SQL = `
    INSERT INTO products(id, title, category, brand, price, dimensions, characteristics, inventory) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), title, category, brand, price, dimensions, characteristics, inventory]);
  return response.rows[0];
};

// create new seller
const createSeller = async({ user_id})=> {
  const SQL = `
    INSERT INTO sellers(user_id) VALUES($1) RETURNING *
  `;
  const response = await client.query(SQL, [user_id]);
  return response.rows[0];
};

// create store
const createStore = async({ user_id, product_id})=> {
  const SQL = `
    INSERT INTO stores(user_id, product_id) VALUES($1, $2) RETURNING *
  `;
  const response = await client.query(SQL, [user_id, product_id]);
  return response.rows[0];
};



//  createOrder  
const createOrder = async({ user_id})=> {
  let SQL = `
    INSERT INTO orders (id, user_id, product_id, qty, order_collection_id )
    SELECT uuid_generate_v4(), $1, product_id, qty, $2
    FROM cart
        WHERE user_id = $1
    RETURNING *;
  `;
  const response = await client.query(SQL, [ user_id, uuid.v4()]);
  return response.rows;
}

// Add new item to cart 
const addToCart = async({ user_id, product_id, qty })=> {
  const SQL = `
    INSERT INTO cart (id, user_id, product_id, qty)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT ON CONSTRAINT unique_user_id_and_product_id_un DO UPDATE SET qty = cart.qty + 1
    RETURNING *;
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id, product_id, qty]);
 
  return response.rows[0];
};

// Update the quantity of a product items in the cart
const updateCart = async({ user_id, product_id, qty })=> {
  const SQL = `
    UPDATE cart 
    SET qty = $3
    WHERE user_id = $1 AND product_id = $2
    RETURNING *
  `;
  const response = await client.query(SQL, [user_id, product_id, qty]);
  return response.rows[0];
};

// Delete product from the cart
const deleteCartProduct = async({ user_id, id })=> {
  const SQL = `
    DELETE FROM cart 
    WHERE user_id = $1 AND product_id = $2
    RETURNING *;
    `;
  await client.query(SQL, [user_id, id]);
};

// deleteGuestCartProduct
const deleteGuestCartProduct = async({ guest_id, id })=> {
  const SQL = `
    DELETE FROM guest_cart 
    WHERE guest_id = $1 AND product_id = $2
    RETURNING *;
    `;
  await client.query(SQL, [guest_id, id]);
};


////
const deleteProduct = async ({ id }) => {
  // 1. Get image filenames for this product
  const imageQuery = `
    SELECT title FROM images WHERE product_id = $1
  `;
  const imageResult = await client.query(imageQuery, [id]);
  const images = imageResult.rows;

  // 2. Delete the product (this will cascade and delete related images in DB)
  const productQuery = `
    DELETE FROM products
    WHERE id = $1
    RETURNING *;
  `;
  const productResult = await client.query(productQuery, [id]);
  const deletedProduct = productResult.rows[0];

  return { deletedProduct, images };
};


////
const authenticate = async({ email, password })=> {
  const SQL = `
    SELECT id, password
    FROM users
    WHERE email = $1
  `;
  const response = await client.query(SQL, [ email ]);
  if(!response.rows.length || (await bcrypt.compare(password, response.rows[0].password))=== false){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign({ id: response.rows[0].id}, JWT);
  return { token }; //
};


const findUserWithToken = async(token) => {
  let id;
  try {
    const payload = await jwt.verify(token, JWT);
    id = payload.id;
  }
  catch(ex){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  const SQL = `
    SELECT id, firstname, lastname, email, phone, is_admin, is_engineer
    FROM users
    WHERE id = $1
  `;
  const response = await client.query(SQL, [id]);
  if(!response.rows.length){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  return response.rows[0];
}

// 
const fetchUsers = async()=> {
  const SQL = `
    SELECT * FROM users;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

// fetch all products
const fetchProducts = async()=> {
  const SQL = `
  SELECT
      p.*,
      json_agg(json_build_object('title', i.title, 'caption', i.caption, 'is_showcase', i.is_showcase)) AS images
  FROM products p
  JOIN images i ON p.id = i.product_id
  GROUP BY p.id,
  p.title,
  p.category,
  p.brand,
  p.price,
  p.dimensions,
  p.characteristics,
  p.inventory
  ;
  `;
  const response = await client.query(SQL);
  return response.rows;
};




// fetchCart
const fetchCart = async(user_id)=> {
  const SQL = `
    WITH cart_products AS (
      SELECT p.*, c.*,
      json_agg(json_build_object('title', i.title, 'caption', i.caption, 'is_showcase', i.is_showcase)) AS images
  
      FROM cart c
      JOIN products p ON c.product_id = p.id
      JOIN images i ON c.product_id = i.product_id
      WHERE user_id = $1
      GROUP BY c.id,
        p.id,
        p.title,
        p.category,
        p.brand,
        p.price,
        p.dimensions,
        p.characteristics,
        p.inventory
    ),
    cost_and_subtotal_calculation AS (
        SELECT SUM(price * qty) AS subtotal, SUM(qty) AS cart_count
        FROM cart_products
    )
    SELECT *,
          (ROUND(subtotal * ($2::numeric / 100), 2)) AS tax,
          (ROUND(subtotal * (1 + ($2::numeric / 100)), 2)) AS total,
          (price * qty) AS cost_per_product,
          $2 AS tax_rate
    FROM cart_products, cost_and_subtotal_calculation
  ;
`;
  const response = await client.query(SQL, [ user_id, TAX_RATE]);
  return response.rows;
};

// fetchOrderCollections
const fetchOrderCollections = async(user_id)=> {
  const SQL = `
    SELECT DISTINCT order_collection_id 
    FROM orders
    WHERE user_id = $1;
  `;
  const response = await client.query(SQL, [user_id]);
  return response.rows;
};

// fetchOrders
const fetchOrders = async(user_id, order_collection_id)=> {
  const  SQL = `
  WITH combined_order AS (
    SELECT 
      orders.*, 
      products.id AS p_id, products.title, products.price,
      images.title AS image_title, images.caption, images.is_showcase
    FROM orders
    JOIN products ON orders.product_id = products.id
    JOIN images ON orders.product_id = images.product_id
    WHERE user_id = $1 AND order_collection_id = $3 AND images.is_showcase = $4
    ORDER BY created_at DESC
  ),
  items_count_and_subtotal_calculation AS (
    SELECT 
      SUM(price * qty) AS subtotal, 
      SUM(qty) AS items_count
    FROM combined_order
  )
  SELECT user_id,
      order_collection_id,
      created_at,
      updated_at,
      subtotal,
      items_count,
      ROUND(subtotal * ($2::numeric / 100), 2) AS tax,
      ROUND(subtotal * (1 + ($2::numeric / 100)), 2)  AS total,
      $2 AS tax_rate,
      json_agg(json_build_object(
          'order_id', id,
          'product_id', product_id,
          'qty' , qty, 
          'title', title,
          'price', price,
          'cost_per_product', price * qty,
          'image_title', image_title,
          'caption', caption,
          'is_showcase', is_showcase)) AS items
  FROM combined_order, items_count_and_subtotal_calculation
  GROUP BY 
    user_id,
    order_collection_id,
    created_at,
    updated_at,
    subtotal,
    items_count,
    tax,
    total,
    tax_rate
  ;
`;
const response = await client.query(SQL, [ user_id, TAX_RATE, order_collection_id, true]);
return response.rows[0]
}

// fetchSingleProduct
const fetchSingleProduct = async(id)=> {
  const SQL = `
    WITH product_data AS (
      SELECT
          id,
          title,
          category,
          brand,
          price,
          dimensions,
          characteristics,
          inventory
      FROM products where id = $1
  )
  SELECT
      pd.*,
      json_agg(json_build_object('title', c.title, 'caption', c.caption, 'is_showcase', c.is_showcase)) AS images
  FROM product_data pd
  JOIN images c ON pd.id = c.product_id
  GROUP BY pd.id, 
  pd.title,
  pd.category,
  pd.brand,
  pd.price,
  pd.dimensions,
  pd.characteristics,
  pd.inventory
  ;
  `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

// create new guest
const createGuest = async()=> {
  const SQL = `
    INSERT INTO guests(id) VALUES($1) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4()]);
  return response.rows[0];
};

// fetchGuest

const fetchGuest = async(id) =>{
  const SQL = `
    SELECT * FROM guests where id = $1
  `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

// fetchGuestCart ..
const fetchGuestCart = async(guest_id) => {
  
  const SQL = `
    WITH cart_products AS (
      SELECT p.*, c.*,
      json_agg(json_build_object('title', i.title, 'caption', i.caption, 'is_showcase', i.is_showcase)) AS images
  
      FROM guest_cart c
      JOIN products p ON c.product_id = p.id
      JOIN images i ON c.product_id = i.product_id
      WHERE guest_id = $1
      GROUP BY c.id,
        p.id,
        p.title,
        p.category,
        p.brand,
        p.price,
        p.dimensions,
        p.characteristics,
        p.inventory
    ),
    cost_and_subtotal_calculation AS (
        SELECT SUM(price * qty) AS subtotal, SUM(qty) AS cart_count
        FROM cart_products
    )
    SELECT *,
          (ROUND(subtotal * ($2::numeric / 100), 2)) AS tax,
          (ROUND(subtotal * (1 + ($2::numeric / 100)), 2)) AS total,
          (price * qty) AS cost_per_product,
          $2 AS tax_rate
    FROM cart_products, cost_and_subtotal_calculation
  ;
`;
  const response = await client.query(SQL, [ guest_id, TAX_RATE]);
  return response.rows;
}
const fetchGuestCartj = async(guest_id)=> {
  const SQL = `
    WITH guest_cart_products AS (
      SELECT *
      FROM guest_cart
      JOIN products ON guest_cart.product_id = products.id
      WHERE guest_id = $1
      ORDER BY product_id ASC
    ),
    cost_and_subtotal_calculation AS (
        SELECT SUM(price * qty) AS subtotal, SUM(qty) AS cart_count
        FROM guest_cart_products
    )
    SELECT *,
          (ROUND(subtotal * ($2::numeric / 100), 2)) AS tax,
          (ROUND(subtotal * (1 + ($2::numeric / 100)), 2)) AS total,
          (price * qty) AS cost_per_product,
          $2 AS tax_rate
    FROM guest_cart_products, cost_and_subtotal_calculation
  ;
`;
  const response = await client.query(SQL, [ guest_id, TAX_RATE]);
  return response.rows;
};



// Add new item to guest cart 
const addToGuestCart = async({ guest_id, product_id, qty })=> {
  const SQL = `
    INSERT INTO guest_cart (id, guest_id, product_id, qty)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT ON CONSTRAINT unique_guest_id_and_product_id DO UPDATE SET qty = guest_cart.qty + $4
    RETURNING *;
  `;
  const response = await client.query(SQL, [uuid.v4(), guest_id, product_id, qty]);
 
  return response.rows[0];
};

// Update the quantity of a product items in the guest cart
const updateGuestCart = async({ guest_id, product_id, qty })=> {
  const SQL = `
    UPDATE guest_cart
    SET qty = $3
    WHERE guest_id = $1 AND product_id = $2
    RETURNING *
  `;
  const response = await client.query(SQL, [guest_id, product_id, qty]);
  return response.rows[0];
};


// saveFileInfo 
const saveFileInfo = async({fileName, caption})=> {
  const SQL = `
  INSERT INTO files(id, filename, caption) VALUES($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), fileName, caption]);
  return response.rows[0];
};

// saveImageInfo
const saveImageInfo = async({fileName, caption, is_showcase, product_id})=> {
  const SQL = `
  INSERT INTO images(id, title, caption, is_showcase, product_id) VALUES($1, $2, $3, $4, $5) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), fileName, caption, is_showcase, product_id]);
  return response.rows[0];
};


// fetchFiles
const fetchFiles = async()=> {
  const SQL = `
    SELECT * FROM files;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

// addProductImage
const addProductImage = async(title, caption, product_id, is_showcase) => {
  const SQL = `
    INSERT into images(id, title, caption, product_id, is_showcase) VALUES($1, $2, $3, $4, $5) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), title, caption, product_id, is_showcase])
  return response.rows[0];
};


module.exports = {
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
  };

