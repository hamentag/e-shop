
const baseURL = '';

//
export const fetchCategories = async () => {
  const response = await fetch(`${baseURL}/api/category`);
  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Failed to fetch categories');
  return json;
};