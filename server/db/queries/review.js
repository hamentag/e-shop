// /server/db/queries/review.js
const { client } = require('../../db');

async function createReview({ id, product_id, user_id, rating, comment }) {
  const { rows } = await client.query(`
    INSERT INTO review (id, product_id, user_id, rating, comment)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `, [id, product_id, user_id, rating, comment]);

  return rows[0];
}

module.exports = { createReview };
