
const { 
    client, 
    createTables,
    createUser,
    createProduct,
    fetchUsers,
    fetchProducts
} = require('./db');
const express = require('express');
const app = express();
app.use(express.json());
const { faker } = require('@faker-js/faker');

const init = async()=> {
    const port = process.env.PORT || 3000;
    console.log('connecting to database');
    await client.connect();
    console.log('connected to database');
    await createTables();
    console.log('tables created');

    const createRandUser = () => {
        return  createUser({
          firstname: faker.person.firstName(),
          lastname: faker.person.lastName(),
          email: faker.internet.email(),
          
          phone: faker.phone.number(),
          password: faker.internet.password({ length: 15 }),
          is_admin: faker.datatype.boolean(0.1),
          is_engineer: faker.datatype.boolean(0.1)
          }) 
      };
      const createRandProduct = () => {
        return createProduct({
          title: faker.commerce.productName(), 
          category: faker.commerce.product(),  
          price: faker.number.float({ min: 30, max: 1500, fractionDigits: 2}),
          description: faker.commerce.productDescription(), 
          inventory: faker.number.int({ min: 2, max: 30}),
          image: faker.image.url(64,48)
        }) 
      };
      
      //
      const numUsers = 10;
      const numProducts = 50; 
      const usersDummyDataFaker = await Promise.all(Array.from({length: numUsers}, createRandUser));
      const productsDummyDataFaker = await Promise.all(Array.from({length: numProducts}, createRandProduct));
  
      //
      const usersDummyData = await Promise.all([
        createUser({firstname: 'Adam', lastname: 'Am', 
                    email:'adam@com', phone: '6151328764', password: 'adam_pw', 
                    is_admin: false, is_engineer: true}),
        createUser({firstname: 'Yasir', lastname: 'Atg', 
                    email:'yasir@com', phone: '6291382734', password: 'yasir_pw', 
                    is_admin: true, is_engineer: false}),
       ]);
  
      console.log(await fetchUsers());
      console.log(await fetchProducts());
      
  
      app.listen(port, ()=> console.log(`listening on port ${port}`));

}

init();