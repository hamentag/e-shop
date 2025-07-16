// api/cart.js

const baseURL = '';

//
export const fetchUserCart = async (userId, token) => {
  const response = await fetch(`/api/users/${userId}/cart`, {
    headers: { authorization: token },
  });
  return await response.json();
};

//
export const fetchGuestCart = async (guestId) => {
  const response = await fetch(`/api/guests/${guestId}/cart`);
  return await response.json();
};



//
export const addToUserCart = async (userId, product_id, qty, token) => {
  const response = await fetch(`/api/users/${userId}/cart`, {
    method: 'POST',
    body: JSON.stringify({ product_id, qty }),
    headers: {
      'Content-Type': 'application/json',
      authorization: token
    }
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || 'Failed to add to user cart');
  }

  return json;
};

//
export const addToGuestCart = async (guestId, product_id, qty) => {
  const response = await fetch(`/api/guests/${guestId}/guest_cart`, {
    method: 'POST',
    body: JSON.stringify({ product_id, qty }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || 'Failed to add to guest cart');
  }

  return json;
};


//
export const updateUserCart = async (userId, product_id, qty, token) => {
  const response = await fetch(`${baseURL}/api/users/${userId}/cart`, {
    method: 'PUT',
    body: JSON.stringify({ product_id, qty }),
    headers: {
      'Content-Type': 'application/json',
      authorization: token,
    },
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Failed to update user cart');
  return json;
};

export const updateGuestCart = async (guestId, product_id, qty) => {
  const response = await fetch(`${baseURL}/api/guests/${guestId}/cart`, {
    method: 'PUT',
    body: JSON.stringify({ product_id, qty }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Failed to update guest cart');
  return json;
};

export const removeFromUserCart = async (userId, productId, token) => {
  const response = await fetch(`${baseURL}/api/users/${userId}/cart/${productId}`, {
    method: 'DELETE',
    headers: {
      authorization: token,
    },
  });

  if (!response.ok) {
    const json = await response.json();
    throw new Error(json.error || 'Failed to remove item from user cart');
  }
};

export const removeFromGuestCart = async (guestId, productId) => {
  const response = await fetch(`${baseURL}/api/guests/${guestId}/cart/${productId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const json = await response.json();
    throw new Error(json.error || 'Failed to remove item from guest cart');
  }
};

