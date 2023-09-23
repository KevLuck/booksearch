import { decode, verify } from 'jsonwebtoken';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('id_token');
  }

  // Get the user's profile data from the token
  getProfile() {
    const decodedToken = decode(this.token);
    return decodedToken.user;
  }

  // Check if the user is logged in
  loggedIn() {
    return this.token && verify(this.token, process.env.JWT_SECRET);
  }

  // Check if the token is expired
  isTokenExpired() {
    const decodedToken = decode(this.token);
    return decodedToken.exp < Date.now() / 1000;
  }

  // Get the token
  getToken() {
    return this.token;
  }

  // Login the user
  login(idToken) {
    this.token = idToken;
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  // Logout the user
  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();
