import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;

  constructor(
    private http: HttpClient
    ) { }

  registerUser(user) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/api/register', user, { headers : headers }).pipe(map(res => JSON.stringify(res)));
  }

  loginUser(user) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/api/authenticate', user, {headers: headers}).pipe(map(res => JSON.stringify(res)));
  }

  getProfile() {
    this.loadToken();
    const headers = new HttpHeaders({'Authorization': this.authToken, 'Content-Type': 'application/json'});
    return this.http.get('http://localhost:3000/api/profile', { headers: headers }).pipe(map(res => JSON.stringify(res)));
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }
  getToken() {
    return localStorage.getItem('id_token');
  }
  isLoggednIn() {
    return this.getToken() !== null;
  }
  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  logoutUser() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}
