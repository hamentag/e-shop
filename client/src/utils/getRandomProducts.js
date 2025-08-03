// getRandomProducts

export function getRandomProducts(products, count) {
  const selectedIndexes = new Set();
  const selectedProducts = [];
  const maxAttempts = 1000;
  let attempts = 0;

  while (selectedProducts.length < count && attempts < maxAttempts) {
    const randIndex = Math.floor(Math.random() * products.length);
    if (!selectedIndexes.has(randIndex)) {
      selectedIndexes.add(randIndex);
      selectedProducts.push(products[randIndex]);
    }
    attempts++;
  }

  return selectedProducts;
}
