const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/eCommerce_site_db');
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
    
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";



    CREATE TABLE users(
      id UUID PRIMARY KEY,
      firstname VARCHAR(40) NOT NULL,
      lastname VARCHAR(40) NOT NULL,
      email VARCHAR(155) UNIQUE NOT NULL,
      password VARCHAR(155) NOT NULL,
      phone VARCHAR(25),
      is_admin BOOLEAN DEFAULT false,
      is_engineer BOOLEAN DEFAULT false
    );
    CREATE TABLE products(
      id UUID PRIMARY KEY,
      title VARCHAR(35) NOT NULL,
      category VARCHAR(35) NOT NULL,
      price NUMERIC NOT NULL,
      dimensions VARCHAR(45) NOT NULL,
      characteristics VARCHAR(255) NOT NULL,
      inventory INTEGER NOT NULL,
      image VARCHAR(500)
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
      order_batch UUID,
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
    

    -- check constraint function to validate data before insert or update the cart quantity
    CREATE OR REPLACE FUNCTION check_cart_quantity_less_than_inventory()
    RETURNS TRIGGER AS $$
    BEGIN
        IF (SELECT inventory FROM products WHERE id = NEW.product_id) < NEW.qty THEN
            RAISE EXCEPTION 'Oops! It seems you have added more items to your cart than we have in stock.';
        END IF;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Create trigger to execute check constraint function
    CREATE TRIGGER check_cart_quantity_trigger
    BEFORE INSERT OR UPDATE ON cart
    FOR EACH ROW
    EXECUTE FUNCTION check_cart_quantity_less_than_inventory();


    
    -- Clear cart when order is created
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


const createUser = async({ firstname, lastname, email, phone, password, is_admin, is_engineer})=> {
  const SQL = `
    INSERT INTO users(id, firstname, lastname, email, phone, password, is_admin, is_engineer) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), firstname, lastname, email, phone, await bcrypt.hash(password, 5), is_admin, is_engineer]);
  return response.rows[0];
};

const createProduct = async({ title, category, price, dimensions, characteristics, inventory, image })=> {
  const SQL = `
    INSERT INTO products(id, title, category, price, dimensions, characteristics, inventory, image) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), title, category, price, dimensions, characteristics, inventory, image]);
  return response.rows[0];
};

//  createOrder  
const createOrder = async({ user_id})=> {
  let SQL = `
    INSERT INTO orders (id, user_id, product_id, qty, order_batch )
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

const deleteProduct = async({id}) =>{
  const SQL = `
    DELETE FROM products
    WHERE id = $1
    RETURNING *;  
  `;
  await client.query(SQL, [id]);
}

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

//
const fetchProducts = async()=> {
  const SQL = `
    SELECT * FROM products;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

// fetchCart
const fetchCart = async(user_id)=> {
  const SQL = `
    WITH cart_products AS (
      SELECT *
      FROM cart
      JOIN products ON cart.product_id = products.id
      WHERE user_id = $1
      ORDER BY product_id ASC
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



// fetchOrders
const fetchOrders = async(user_id)=> {
  let SQL = `
    SELECT DISTINCT order_batch 
    FROM orders
    WHERE user_id = $1;
  `;
  const response = await client.query(SQL, [user_id]);
  const orderBatches = response.rows;
  
  SQL = `
    WITH order_products AS (
      SELECT *
      FROM orders
      JOIN products ON orders.product_id = products.id
      WHERE user_id = $1 AND order_batch = $3
      ORDER BY created_at DESC
    ),
    items_count_and_subtotal_calculation AS (
        SELECT SUM(price * qty) AS subtotal, SUM(qty) AS items_count
        FROM order_products
    )
    SELECT *,
          (ROUND(subtotal * ($2::numeric / 100), 2)) AS tax,
          (ROUND(subtotal * (1 + ($2::numeric / 100)), 2)) AS total,
          (price * qty) AS cost_per_product,
          $2 AS tax_rate
    FROM order_products, items_count_and_subtotal_calculation
    ;
  `;

  const detailedOrderBatchs = await Promise.all(orderBatches.map(async(el)=> {
    const detailedOrderBatch = await client.query(SQL, [ user_id, TAX_RATE, el.order_batch]);
    return detailedOrderBatch.rows;
  }))

  // sorting order batches
  detailedOrderBatchs.sort((a, b) => {
    const keyA = a[0].created_at;
    const keyB = b[0].created_at;
    return keyB - keyA; // descending order
});

  return detailedOrderBatchs;
};


//
const fetchSingleProduct = async(id) =>{
  const SQL = `
    SELECT * FROM products where id = $1
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


// fetchGuestCart
const fetchGuestCart = async(guest_id)=> {
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
    ON CONFLICT ON CONSTRAINT unique_guest_id_and_product_id DO UPDATE SET qty = guest_cart.qty + 1
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


module.exports = {
  client,
  createTables,
  createUser, 
  createProduct,
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
  fetchOrders,
  };
