// api/order.js

const baseURL = '';

export const fetchOrders = async (userId, token) => {
  const response = await fetch(`${baseURL}/api/users/${userId}/orders`, {
    headers: {
      authorization: token
    }
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Failed to fetch orders');
  return json;
};

export const createOrder = async (userId, token) => {
  const response = await fetch(`${baseURL}/api/users/${userId}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: token
    }
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Failed to create order');
  return json;
};
