// constants.js

// Stripe Publishable Key
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RqJFJJWvaLRRX9Qkhi8mQfY1cFFvzRdwWCT7DksnjaaiMdev2G1XpgNOj0Vu7hhYoxEr0XVuqzAcQ4pCRkxe3H500VZp8wjkW';

// US states
export const US_STATES = [
  { name: 'Alabama', code: 'AL' },
  { name: 'Alaska', code: 'AK' },
  { name: 'Arizona', code: 'AZ' },
  { name: 'Arkansas', code: 'AR' },
  { name: 'California', code: 'CA' },
  { name: 'Colorado', code: 'CO' },
  { name: 'Connecticut', code: 'CT' },
  { name: 'Delaware', code: 'DE' },
  { name: 'Florida', code: 'FL' },
  { name: 'Georgia', code: 'GA' },
  { name: 'Hawaii', code: 'HI' },
  { name: 'Idaho', code: 'ID' },
  { name: 'Illinois', code: 'IL' },
  { name: 'Indiana', code: 'IN' },
  { name: 'Iowa', code: 'IA' },
  { name: 'Kansas', code: 'KS' },
  { name: 'Kentucky', code: 'KY' },
  { name: 'Louisiana', code: 'LA' },
  { name: 'Maine', code: 'ME' },
  { name: 'Maryland', code: 'MD' },
  { name: 'Massachusetts', code: 'MA' },
  { name: 'Michigan', code: 'MI' },
  { name: 'Minnesota', code: 'MN' },
  { name: 'Mississippi', code: 'MS' },
  { name: 'Missouri', code: 'MO' },
  { name: 'Montana', code: 'MT' },
  { name: 'Nebraska', code: 'NE' },
  { name: 'Nevada', code: 'NV' },
  { name: 'New Hampshire', code: 'NH' },
  { name: 'New Jersey', code: 'NJ' },
  { name: 'New Mexico', code: 'NM' },
  { name: 'New York', code: 'NY' },
  { name: 'North Carolina', code: 'NC' },
  { name: 'North Dakota', code: 'ND' },
  { name: 'Ohio', code: 'OH' },
  { name: 'Oklahoma', code: 'OK' },
  { name: 'Oregon', code: 'OR' },
  { name: 'Pennsylvania', code: 'PA' },
  { name: 'Rhode Island', code: 'RI' },
  { name: 'South Carolina', code: 'SC' },
  { name: 'South Dakota', code: 'SD' },
  { name: 'Tennessee', code: 'TN' },
  { name: 'Texas', code: 'TX' },
  { name: 'Utah', code: 'UT' },
  { name: 'Vermont', code: 'VT' },
  { name: 'Virginia', code: 'VA' },
  { name: 'Washington', code: 'WA' },
  { name: 'West Virginia', code: 'WV' },
  { name: 'Wisconsin', code: 'WI' },
  { name: 'Wyoming', code: 'WY' }
];


// Empty image titles (/src/public)
export const EMPTY_IMAGES = [
  'empty-cart.svg',
  'empty.svg',
  'no-data.svg',
  'web-search.svg',
];



// login-illustrations (/src/public)
export const REQUIRE_LOGIN = [
  {
    src: 'enter-password.svg',
    title: 'Please log in to proceed with checkout',
    message: 'Log in or create an account to complete your order.',
  },
  {
    src: 'login-weas.svg',
    title: 'You are almost there!',
    message: 'Please take a moment to log in or sign up to continue with your order.',
  },
  {
    src: 'fingerprint-login.svg',
    title: 'Log in required to continue',
    message: "You'll need to log in or sign up to finish your order.",
  },
  {
    src: 'secure-password.svg',
    title: 'Log in to place your order',
    message: "No worries, your cart is saved, and checkout is just a step away.",
  },
];
