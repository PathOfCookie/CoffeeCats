const AUTH_SERVICE_URL =
  process.env.REACT_APP_AUTH_SERVICE_URL || 'http://localhost:3001';

const MAIN_SERVICE_URL =
  process.env.REACT_APP_MAIN_SERVICE_URL ||
  process.env.REACT_APP_PRODUCTS_SERVICE_URL ||
  process.env.REACT_APP_CATS_SERVICE_URL ||
  'http://localhost:3000';

export { AUTH_SERVICE_URL, MAIN_SERVICE_URL };
