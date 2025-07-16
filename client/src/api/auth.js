// api/auth.js

const baseURL = '';

// login
export const login = async (credentials) => {
  const response = await fetch(`${baseURL}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify(credentials),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Login failed');
  return json;
};

// register
export const register = async (newUserData) => {
  const response = await fetch(`${baseURL}/api/auth/register`, {
    method: 'POST',
    body: JSON.stringify(newUserData),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Registration failed');
  return json;
};


// attemptLoginWithToken
export const attemptLoginWithToken = async (token) => {
  const response = await fetch(`${baseURL}/api/auth/me`, {
    headers: {
      authorization: token,
    },
  });

  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Token validation failed');
  return json;
};
