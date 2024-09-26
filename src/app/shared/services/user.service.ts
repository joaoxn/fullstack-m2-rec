import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInterface } from '../interfaces/user.interface';
import { UserDtoInterface } from '../interfaces/user.dto.interface';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = 'http://localhost:3000/users';

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<UserInterface[] | HttpErrorResponse> {
    return this.httpClient.get<UserInterface[]>(this.url)
      .pipe(catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        return of(error);
      }));
  }

  get(id: string): Observable<UserInterface | HttpErrorResponse> {
    return this.httpClient.get<UserInterface>(`${this.url}/${id}`)
      .pipe(catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        return of(error);
      }));
  }

  getByEmail(email: string): Observable<UserInterface | HttpErrorResponse | undefined> {
    return this.httpClient.get<UserInterface[]>(`${this.url}?email=${email}`).pipe(
      map(users => {
        if (users.length > 1)
          console.warn(`Multiple users found with the same email (${email})`, users);
        return users[0]; // Returns undefined if the array is empty
      }),
      catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        return of(error);
      })
    );
  }

  add(user: UserDtoInterface): Observable<UserInterface | HttpErrorResponse> {
    return this.httpClient.post<UserInterface>(this.url, user)
    .pipe(catchError((error: HttpErrorResponse) => {
      console.error("Http Error:", error.message);
      return of(error);
    }));
  }

  update(id: string, user: UserDtoInterface): Observable<UserInterface | HttpErrorResponse> {
    return this.httpClient.put<UserInterface>(`${this.url}/${id}`, user)
    .pipe(catchError((error: HttpErrorResponse) => {
      console.error("Http Error:", error.message);
      return of(error);
    }));
  }

  delete(id: string): Observable<UserInterface | HttpErrorResponse> {
    return this.httpClient.delete<UserInterface>(`${this.url}/${id}`)
    .pipe(catchError((error: HttpErrorResponse) => {
      console.error("Http Error:", error.message);
      return of(error);
    }));
  }

  registerStudent(userId: string, studentId: string): Observable<boolean> {
    return this.get(userId).pipe(
      map(user => {
        if (user instanceof HttpErrorResponse) return false;

        user.studentsId.push(studentId.toString());
        this.update(userId, user).subscribe();
        return true;
      }));
  }

  registerTraining(userId: string, trainingId: string): Observable<boolean> {
    return this.get(userId).pipe(
      map(user => {
        if (user instanceof HttpErrorResponse) return false;

        user.trainingsId.push(trainingId.toString());
        this.update(userId, user).subscribe();
        return true;
      }));
  }

  unregisterStudent(userId: string, studentId: string): Observable<boolean> {
    return this.get(userId).pipe(
      map(user => {
        if (user instanceof HttpErrorResponse) return false;
        let index = user.studentsId.indexOf(studentId.toString());
        if (index === -1)
          return false;

        user.studentsId = user.studentsId.splice(index, 1);
        this.update(userId, user).subscribe();
        return true;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404)
          console.error("Http Error:", error.message);
        return of(false);
      })
    );
  }

  unregisterTraining(userId: string, trainingId: string): Observable<boolean> {
    return this.get(userId).pipe(
      map((user) => {
        if (user instanceof HttpErrorResponse) return false;
        let index = user.trainingsId.indexOf(trainingId.toString());
        if (index === -1)
          return false;

        user.trainingsId = user.trainingsId.splice(index, 1);
        this.update(userId, user).subscribe();
        return true;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404)
          console.error("Http Error:", error.message);
        return of(false);
      })
    );
  }

  login(email: string, password: string): Observable<boolean> {
    return this.getByEmail(email).pipe(
      map(user => {
        if (user instanceof HttpErrorResponse || !user) {
          console.warn("Login unauthorized.", "Returned:", user);
          return false;
        }

        if (user.password != password) {
          console.warn("Login verification unauthorized. Password does not match (received: "+password+")");
          return false;
        }

        localStorage.setItem('loginUser', JSON.stringify({
          userId: user.id,
          auth: Date.now() * 1000
        }));

        console.info(`Logged-in with id ${user.id} successfully`);
        return true;
      }));
  }

  validateAuth(): number | false {
    const loginUser = localStorage.getItem('loginUser');
    if (!loginUser) return false;

    const auth = JSON.parse(loginUser).auth;
    if (!auth) return false;

    if (Date.now() * 1000 - auth > 3600) return false; // If auth older than 3600 seconds (1 hour) returns false
    return auth.userId;
  }
}
