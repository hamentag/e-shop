
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/capstone_eComm_db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');


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

module.exports = { 
  client, 
  createTables,
  createUser,
  createProduct,
  fetchUsers,
  fetchProducts
}
