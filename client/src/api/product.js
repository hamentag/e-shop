// api/product.js

const baseURL = '';

//
export const fetchProducts = async () => {
  const response = await fetch(`${baseURL}/api/products`);
  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Failed to fetch products');
  return json;
};

//
export const fetchProductsByCategory = async (categoryId) => {
  const response = await fetch(`${baseURL}/api/category/${categoryId}/products`);
  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Failed to fetch products');
  return json;  
}

//
export const fetchHomeImages = async () => {
  const response = await fetch(`${baseURL}/api/home-images`);
  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Failed to fetch home images');
  return json;
};

//
export const createProduct = async (userId, formData, token) => {
  const response = await fetch(`${baseURL}/api/users/${userId}/products`, {
    method: 'POST',
    body: formData,
    headers: {
      authorization: token,
    },
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Failed to create product');
  return json;
};

//
export const deleteProduct = async (productId, token) => {
  const response = await fetch(`${baseURL}/api/products/${productId}`, {
    method: 'DELETE',
    headers: {
      authorization: token,
    },
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Failed to delete product');
  return json;
};

