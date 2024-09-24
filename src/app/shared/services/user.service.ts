import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInterface } from '../interfaces/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = 'http://localhost:3000/user';

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<UserInterface[]> {
    return this.httpClient.get<UserInterface[]>(this.url);
  }

  get(id: string): Observable<UserInterface> {
    return this.httpClient.get<UserInterface>(`${this.url}/${id}`);
  }

  create(user: UserInterface): Observable<Object> {
    return this.httpClient.post(this.url, user);
  }

  update(id: number, user: UserInterface): Observable<Object> {
    return this.httpClient.put(`${this.url}/${id}`, user);
  }

  delete(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.url}/${id}`);
  }
}
