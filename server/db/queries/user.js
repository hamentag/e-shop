// server/db/queries/user.js

const { client } = require('../../db');

async function getAllUserIds() {
  const { rows } = await client.query(`SELECT id FROM users`);
  return rows;
}


module.exports = {
  getAllUserIds,
};