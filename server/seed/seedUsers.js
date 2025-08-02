// server/seed/seedUsers.js
const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const { createUser } = require('../db');

const NUM_FAKE_USERS = 100;

const seedUsers = async () => {
  console.log('👥 Seeding users...');

  // Create known users
  const knownUsers = [
    {
      firstname: 'Demo', lastname: 'Example',
      email: 'demo@example.com', phone: '6151328764',
      password: 'eshop', is_admin: false, is_engineer: false,
    },
    {
      firstname: 'Yasir', lastname: 'Amentag',
      email: 'yasir@com', phone: '6291382734',
      password: 'yasir_pw', is_admin: true, is_engineer: false,
    },
    {
      firstname: 'Wisam', lastname: 'Amentag',
      email: 'c@m', phone: '6291682722',
      password: 'tst', is_admin: true, is_engineer: true,
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

  console.log(`✅ Seeded ${knownUsers.length + NUM_FAKE_USERS} users`);
};

module.exports = { seedUsers };
