// /server/utils/randomReview.js

const reviews = [
  { rating: 5, comment: "Absolutely fantastic! Highly recommend." },
  { rating: 5, comment: "Excellent quality and great value!" },
  { rating: 5, comment: "Amazing product, exceeded expectations." },
  { rating: 4, comment: "Very good, would recommend." },
  { rating: 4, comment: "Great product. Will buy again." },
  
  { rating: 3, comment: "It's okay, nothing special." },
  
  { rating: 2, comment: "Not great, could be better." },
  { rating: 1, comment: "Would not recommend. Poor quality." }
];

function getRandomReview() {
  const review = reviews[Math.floor(Math.random() * reviews.length)];
  return review;
}

module.exports = { getRandomReview };
