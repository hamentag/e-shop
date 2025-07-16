// api/user.js

const baseURL = '';

export const createGuest = async () => {
  const response = await fetch(`${baseURL}/api/guests/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Failed to create guest');
  return json;
};

// checkGuest
export const checkGuest = async (id) => {
  const response = await fetch(`${baseURL}/api/guests/${id}`);

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Invalid guest ID');
  return json;
};


// Later ..
export const addUser = async (data) => {
  // implementation...
};

export const removeUser = async (id) => {
  // implementation...
};
