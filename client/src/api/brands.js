
const baseURL = '';

//
export const fetchTopBrands = async () => {
  const response = await fetch(`${baseURL}/api/top-brands`);
  const json = await response.json();
  if (!response.ok) throw new Error(json.error || 'Failed to fetch top brands');
  return json;
};