// server/seed/seedUsers.js
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const { client, createUser } = require('../db');


const NUM_FAKE_USERS = 100;

// Check if --force passed
const FORCE = process.argv.includes('--force');

const seedUsers = async () => {
 
  // Check for existing users
  const result = await client.query('SELECT COUNT(*)::int AS count FROM users');
  const existingUserCount = result.rows[0].count;

  if (existingUserCount > 0 && !FORCE) {
    console.log(`Skipping seed: Users already exist (${existingUserCount}). Use "--force" to override.`);
    return;
  }

  if (FORCE) {
    console.log('Force mode: clearing existing users...');
    await client.query('DELETE FROM users');
  }

  console.log('Seeding users...');

  // Create known users
  const knownUsers = [
    {
      firstname: 'Demo', lastname: 'Example',
      email: 'demo@example.com', phone: '6151328764',
      password: 'eshop',
      is_admin: false, is_engineer: false,
    },
    {
      firstname: 'Yasir', lastname: 'Amentag',
      email: 'yasir@com', phone: '6291382734',
      password: process.env.YASIR_PASSWORD || 'fallback_pw',
      is_admin: true, is_engineer: false,
    },
    {
      firstname: 'Wisam', lastname: 'Amentag',
      email: 'c@m', phone: '6291682722',
      password: process.env.WISAM_PASSWORD || 'fallback_pw',
      is_admin: true, is_engineer: true,
    },
  ];


  for (const user of knownUsers) {
    await createUser(user);
  }

  // Create fake users
  for (let i = 0; i < NUM_FAKE_USERS; i++) {
    const fakeUser = {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: faker.internet.email(),
      phone: '6' + faker.string.numeric(8),
      password: 'password123',
      is_admin: false,
      is_engineer: false,
    };

    await createUser(fakeUser);
  }

  console.log(`Seeded ${knownUsers.length + NUM_FAKE_USERS} users`);
};

module.exports = { seedUsers };



if (require.main === module) {
  (async () => {
    try {
      await client.connect();
      await seedUsers();
      await client.end();
    } catch (err) {
      console.error('Error seeding users:', err);
      process.exit(1);
    }
  })();
}

