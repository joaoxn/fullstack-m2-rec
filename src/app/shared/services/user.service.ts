import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInterface } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = 'http://localhost:3000/users';

  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get(this.url);
  }

  get(id: number) {
    return this.httpClient.get(`${this.url}/${id}`);
  }

  create(user: UserInterface) {
    return this.httpClient.post(this.url, user);
  }

  update(id: number, user: UserInterface) {
    return this.httpClient.put(`${this.url}/${id}`, user);
  }

  delete(id: number) {
    return this.httpClient.delete(`${this.url}/${id}`);
  }
}
