// 

const MAX_CATEGORIES = 4; // Select up to 4 categories

export function selectCategories(products) {
  const categorySet = new Set();

  for (const product of products) {
    const category = product.category;
    if (!categorySet.has(category)) {
      categorySet.add(category);
      if (categorySet.size === MAX_CATEGORIES) {
        break; 
      }
    }
  }

  return Array.from(categorySet);
}

