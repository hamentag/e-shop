
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/capstone_eComm_db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT || 'shhh';
const TAX_RATE = 6.5;

const createTables = async()=> {
    const SQL = `
      -- Create tables:
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS cart CASCADE;
      DROP TABLE IF EXISTS orders CASCADE;
  
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
        description VARCHAR(255) NOT NULL,
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
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()        
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

const createProduct = async({ title, category, price, description, inventory, image })=> {
  const SQL = `
    INSERT INTO products(id, title, category, price, description, inventory, image) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), title, category, price, description, inventory, image]);
  return response.rows[0];
};

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

//
const fetchSingleProduct = async(id) =>{
  const SQL = `
    SELECT * FROM products where id = $1
  `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};


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

const addToCart = async({ user_id, product_id, qty })=> {
  const SQL = `
    INSERT INTO cart (id, user_id, product_id, qty)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id, product_id, qty]);
 
  return response.rows[0];
};

// 
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
        SELECT SUM(price * qty) AS subtotal
        FROM cart_products
    )
    SELECT *,
          (ROUND(subtotal * ($2::numeric / 100), 2)) AS tax,
          (ROUND(subtotal * (1 + ($2::numeric / 100)), 2)) AS total,
          (price * qty) AS cos_pr,
          $2 AS tax_rate
    FROM cart_products, cost_and_subtotal_calculation
  ;
`;
  const response = await client.query(SQL, [ user_id, TAX_RATE]);
  return response.rows;
};


module.exports = { 
  client, 
  createTables,
  createUser,
  createProduct,
  fetchUsers,
  fetchProducts,
  fetchSingleProduct, 
  authenticate, 
  findUserWithToken,
  addToCart, 
  updateCart, 
  fetchCart
}
