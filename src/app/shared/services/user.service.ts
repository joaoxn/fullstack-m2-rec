import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInterface } from '../interfaces/user.interface';
import { UserDtoInterface } from '../interfaces/user.dto.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = 'http://localhost:3000/users';

  constructor(private httpClient: HttpClient) { }

  getAll(): UserInterface[] | undefined {
    let response: UserInterface[] | undefined;
    this.httpClient.get<UserInterface[]>(this.url).subscribe(data => response = data);
    return response;
  }

  get(id: string): UserInterface | undefined {
    let response: UserInterface | undefined;
    this.httpClient.get<UserInterface>(`${this.url}/${id}`).subscribe(data => response = data);
    return response;
  }

  getByEmail(email: string, password?: string): UserInterface | [UserInterface, boolean] | undefined {
    let user: UserInterface | undefined = this.getAll()?.find(u => u.email === email);
    if (user && password)
      return [user, user.password === password];
    return user;
  }

  add(user: UserDtoInterface): UserInterface | undefined {
    let response: UserInterface | undefined;
    this.httpClient.post<UserInterface>(this.url, user).subscribe(data => response = data);
    return response;
  }

  update(id: string, user: UserDtoInterface): UserInterface | undefined {
    let response: UserInterface | undefined;
    this.httpClient.put<UserInterface>(`${this.url}/${id}`, user)
    .subscribe(data => response = data);
    return response;
  }

  delete(id: string): UserInterface | undefined {
    let response: UserInterface | undefined;
    this.httpClient.delete<UserInterface>(`${this.url}/${id}`).subscribe(data => response = data);
    return response;
  }
  
  registerStudent(userId: string, studentId: string): boolean {
    let user = this.get(userId);

    if (user) {
      user.studentsId.push(studentId.toString());
      this.update(userId, user);
    }
    return Boolean(user);
  }

  registerTraining(userId: string, trainingId: string): boolean {
    let user = this.get(userId);

    if (user) {
      user.trainingsId.push(trainingId.toString());
      this.update(userId, user);
    }
    return Boolean(user);
  }

  unregisterStudent(userId: string, studentId: string): boolean {
    let user = this.get(userId);

    if (!user) {
      return false;
    }
    let index = user.studentsId.indexOf(studentId.toString());
    if (index === -1) {
      return false;
    }
    user.studentsId = user.studentsId.splice(index, 1);
    this.update(userId, user);
    return true;
  }
  
  unregisterTraining(userId: string, trainingId: string): boolean {
    let user = this.get(userId);

    if (!user) {
      return false;
    }
    let index = user.trainingsId.indexOf(trainingId.toString());
    if (index === -1) {
      return false;
    }
    user.trainingsId = user.trainingsId.splice(index, 1);
    this.update(userId, user);
    return true;
  }
}
