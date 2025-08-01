// api/order.js

const baseURL = '';

//
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

//
export const fetchOrder = async (orderId, token) => {
  const response = await fetch(`/api/users/${orderId}`, {
    headers: {
      authorization: token
    }
  })
  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Failed to fetch order');
  console.log("json Order..//. ", json)
  return json;
}


//
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


export const updateOrderPayment = async (order_collection_id, paymentIntent, token) => {
   const response = await fetch(`/api/orders/${order_collection_id}/payment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({ paymentIntent })
    });

    if (!response.ok) {
      throw new Error('Failed to update payment');
    }

    const fullOrder = await response.json();
    return fullOrder;  
}