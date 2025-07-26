// /server/db/queries/category.js

const {client } = require('../../db');

// fetch all categories

//
const findCategoryByName = async (name) => {
  const SQL = 'SELECT id FROM category WHERE LOWER(name) = $1';
  const response = await client.query(SQL, [name.toLowerCase()]);
  return response.rows?.[0] || null;
};





//
const createCategory = async (id, name) => {
  const SQL = `
    INSERT INTO category (id, name)
    VALUES ($1, $2)
    RETURNING *
  `;
  const result = await client.query(SQL, [id, name]);
  return result.rows[0];
};



module.exports = { findCategoryByName, createCategory }