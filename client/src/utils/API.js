import axios from 'axios';

// create a base URL for all requests
const BASE_URL = '/api/users';

// create a function to get the logged in user's info
export async function getMe(token) {
  const response = await axios.get(`${BASE_URL}/me`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

// create a function to add a new user
export async function addUser(userData) {
  const response = await axios.post(`${BASE_URL}`, userData);

  return response.data;
}

// create a function to login a user
export async function loginUser(userData) {
  const response = await axios.post(`${BASE_URL}/login`, userData);

  return response.data;
}

// create a function to save book data for a logged in user
export async function addBook(bookData, token) {
  const response = await axios.put(`${BASE_URL}`, bookData, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

// create a function to remove saved book data for a logged in user
export async function removeBook(bookId, token) {
  const response = await axios.delete(`${BASE_URL}/books/${bookId}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

// create a function to make a search to the Google Books API
export async function searchGoogleBooks(query) {
  const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}`);

  return response.data;
}
