// /server/db/queries/productCategory.js

const {client } = require('../../db');

const linkProductToCategory = async (productId, categoryId) => {
  const SQL = `
    INSERT INTO product_category (product_id, category_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
  `;
  await client.query(SQL, [productId, categoryId]);
};


const getProductsByCategory = async (categoryId) => {
    // const SQL = `
    //     SELECT p.*
    //     FROM products p
    //     JOIN product_category pc ON p.id = pc.product_id
    //     WHERE pc.category_id = $1;
    // `;

    const SQL = `
    SELECT
      p.*,
      json_agg(
        json_build_object('title', i.title, 'caption', i.caption, 'is_showcase', i.is_showcase)
      ) AS images
    FROM products p
    JOIN product_category pc ON p.id = pc.product_id
    JOIN images i ON p.id = i.product_id
    WHERE pc.category_id = $1
    GROUP BY p.id, p.title, p.brand, p.price, p.dimensions, p.characteristics, p.inventory;
  `;


    const response = await client.query(SQL, [categoryId]);
    console.log("response >>>> ,",  response.rows[0].images)
    return response.rows || null;
}



module.exports = { linkProductToCategory, getProductsByCategory }