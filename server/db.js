const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/capstone_eComm_db');
const uuid = require('uuid');


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

    `;
    
    await client.query(SQL);
  };


module.exports = { client, createTables }