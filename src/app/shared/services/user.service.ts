import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { UserDto } from '../interfaces/user.dto';
import { catchError, finalize, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { error } from 'console';
import { verify } from 'crypto';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly url = 'http://localhost:3000/users';

  currentUser?: User;
  lastSuccessVerifyTimestamp = 0;

  constructor(private httpClient: HttpClient, private router: Router) { }

  getAll(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.url).pipe(
      tap(() => console.log(`GET API at: ${this.url}`)),
      catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      })
    );
  }

  get(id: string): Observable<User> {
    return this.httpClient.get<User>(`${this.url}/${id}`).pipe(
      tap(() => console.log(`GET API at: ${this.url}/${id}`)),
      catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      })
    );
  }

  getByEmail(email: string): Observable<User> {
    return this.httpClient.get<User[]>(`${this.url}?email=${email}`).pipe(
      tap(() => console.log(`GET API at: ${this.url}?email=${email}`)),
      map(users => {
        if (users.length == 0)
          throw new Error("NoSuchEntityError: No user found with such email");
        if (users.length > 1)
          console.warn(`Multiple users found with the same email (${email})`, users);
        return users[0];
      })
    );
  }

  add(user: UserDto): Observable<User> {
    return this.httpClient.post<User>(this.url, user).pipe(
      tap(() => console.log(`POST API at: ${this.url}/ with Body:`, user)),
      catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      })
    );
  }

  update(id: string, user: UserDto): Observable<User> {
    return this.httpClient.put<User>(`${this.url}/${id}`, user).pipe(
      tap(() => console.log(`PUT API at: ${this.url}/${id} with Body:`, user)),
      catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      })
    );
  }

  delete(id: string): Observable<User> {
    return this.httpClient.delete<User>(`${this.url}/${id}`).pipe(
      tap(() => console.log(`DELETE API at: ${this.url}/${id}`)),
      catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      })
    );
  }

  registerStudent(userId: string, studentId: string): Observable<User> {
    return this.get(userId).pipe(
      map(user => {
        user.studentsId.push(studentId);
        this.currentUser = user;
        return user;
      }),
      switchMap(user => this.update(userId, user)));
  }

  registerTraining(userId: string, trainingId: string): Observable<User> {
    return this.get(userId).pipe(
      map(user => {
        user.trainingsId.push(trainingId);
        this.currentUser = user;
        return user;
      }),
      switchMap(user => this.update(userId, user)));
  }

  unregisterStudent(userId: string, studentId: string): Observable<User> {
    return this.get(userId).pipe(
      map(user => {
        let index = user.studentsId.indexOf(studentId);
        if (index == -1) throw new Error("NoSuchEntityError: No student with id: " + studentId);

        user.studentsId.splice(index, 1);
        this.currentUser = user;
        return user;
      }),
      switchMap(user => this.update(userId, user))
    );
  }

  unregisterTraining(userId: string, trainingId: string): Observable<User> {
    return this.get(userId).pipe(
      map(user => {
        let index = user.trainingsId.indexOf(trainingId);
        if (index == -1) throw new Error("NoSuchEntityError: No training with id: " + trainingId);

        user.trainingsId.splice(index, 1);
        this.currentUser = user;
        return user;
      }),
      switchMap(user => this.update(userId, user))
    );
  }

  register(user: UserDto): Observable<string> {
    return this.getByEmail(user.email).pipe(
      switchMap(() =>
        throwError(() => new Error("DuplicateEntityError: Email already registered"))
      ),
      catchError((error: Error) => {
        if (error.message.slice(0, 18) != "NoSuchEntityError:") throw error;

        return this.add(user).pipe(
          switchMap(user => {
            console.info("Registered and logged in successfully");
            return this.logSession(user.id);
          })
        );
      })
    )
  }

  login(email: string, password: string): Observable<string> {
    return this.getByEmail(email).pipe(
      map(user => {
        if (!user || user.password != password) {
          throw new Error("UnauthorizedError: Login unauthorized");
        }
        this.currentUser = user;
        return this.logSession(user.id);
      }));
  }

  logout() {
    this.currentUser = undefined;

    localStorage.removeItem('authToken');
    console.info("Logged out successfully");
    if (this.router.url != '/register')
      this.router.navigate(['/login']);
  }

  logSession(id: string): string {
    localStorage.setItem('authToken', JSON.stringify({
      userId: id,
      auth: Date.now() / 1000
    }));

    console.info(`Logged-in with id ${id} successfully`);
    return id;
  }

  validateAuth(): Observable<User> | false {
    if (typeof window === 'undefined') return false;

    function directErrorReturnCall(): false {
      localStorage.removeItem('authToken');
      return false;
    }
    this.currentUser = undefined;

    const authToken = localStorage.getItem('authToken');
    if (!authToken) return directErrorReturnCall();

    const auth = JSON.parse(authToken).auth;
    if (!auth) return directErrorReturnCall();

    const userId: string = JSON.parse(authToken).userId;
    if (!userId) return directErrorReturnCall();

    return this.get(userId).pipe(
      map(user => {
        // If auth older than 86400 seconds (24 hours) will throw
        if (Date.now() / 1000 - auth < 86400) {
          this.currentUser = user;
          return user;
        }

        localStorage.removeItem("authToken");
        this.logout();
        throw new Error("AuthExpiredError: Authentication expired. Auth: " + auth);
      })
    );
  }
}
