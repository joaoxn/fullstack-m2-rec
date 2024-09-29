import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInterface } from '../interfaces/user.interface';
import { UserDtoInterface } from '../interfaces/user.dto.interface';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { error } from 'console';
import { verify } from 'crypto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = 'http://localhost:3000/users';

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<UserInterface[]> {
    return this.httpClient.get<UserInterface[]>(this.url)
      .pipe(catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      }));
  }

  get(id: string): Observable<UserInterface> {
    return this.httpClient.get<UserInterface>(`${this.url}/${id}`)
      .pipe(catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      }));
  }

  getByEmail(email: string): Observable<UserInterface> {
    return this.httpClient.get<UserInterface[]>(`${this.url}?email=${email}`).pipe(
      map(users => {
        if (users.length == 0)
          throw new Error("No user found with such email");
        if (users.length > 1)
          console.warn(`Multiple users found with the same email (${email})`, users);
        return users[0];
      })
    );
  }

  add(user: UserDtoInterface): Observable<UserInterface> {
    return this.httpClient.post<UserInterface>(this.url, user)
      .pipe(catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      }));
  }

  update(id: string, user: UserDtoInterface): Observable<UserInterface> {
    return this.httpClient.put<UserInterface>(`${this.url}/${id}`, user)
      .pipe(catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      }));
  }

  delete(id: string): Observable<UserInterface> {
    return this.httpClient.delete<UserInterface>(`${this.url}/${id}`)
      .pipe(catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      }));
  }

  registerStudent(userId: string, studentId: string): Observable<UserInterface> {
    return this.get(userId).pipe(
      map(user => {
        user.studentsId.push(studentId.toString());
        return user;
      }),
      switchMap(user => this.update(userId, user)));
  }

  registerTraining(userId: string, trainingId: string): Observable<UserInterface> {
    return this.get(userId).pipe(
      map(user => {
        user.trainingsId.push(trainingId.toString());
        return user;
      }),
      switchMap(user => this.update(userId, user)));
  }

  unregisterStudent(userId: string, studentId: string): Observable<UserInterface> {
    return this.get(userId).pipe(
      map(user => {
        let index = user.studentsId.indexOf(studentId.toString());
        if (index != -1) throw new Error("No student with id: "+ studentId);

        user.studentsId = user.studentsId.splice(index, 1);
        return user;
      }),
      switchMap(user => {
        if (user) this.update(userId, user).pipe(map(() => user));
        return of(user);
      })
    );
  }

  unregisterTraining(userId: string, trainingId: string): Observable<UserInterface> {
    return this.get(userId).pipe(
      map(user => {
        let index = user.trainingsId.indexOf(trainingId.toString());
        if (index != -1) throw new Error("No training with id: "+ trainingId);

        user.trainingsId = user.trainingsId.splice(index, 1);
        return user;
      }),
      switchMap(user => {
        if (user) this.update(userId, user).pipe(map(() => user));
        return of(user);
      })
    );
  }

  register(user: UserDtoInterface): Observable<string | undefined> {
    return this.getByEmail(user.email).pipe(
      map(data => {
        console.log(data);
        console.error("Register failed: Email already registered");
        return undefined;
      }),
      catchError(() =>
        this.add(user).pipe(
          switchMap(user => {
            console.info("Registered and logged in successfully");
            return this.logSession(user.id);
          })
        )
      )
    )
  }

  login(email: string, password: string): Observable<string | undefined> {
    return this.getByEmail(email).pipe(
      map(user => {
        if (!user || user.password != password) {
          console.warn("Login unauthorized");
          return undefined;
        }
        return this.logSession(user.id);
      }));
  }

  logSession(id: string): string {
    localStorage.setItem('authToken', JSON.stringify({
      userId: id,
      auth: Date.now() / 1000
    }));

    console.info(`Logged-in with id ${id} successfully`);
    return id;
  }

  validateAuth(): Observable<string> | false {
    const authToken = localStorage.getItem('authToken');
    const vals = check(authToken);

    function check(authToken: string | null): [any, string] | false {
      if (!authToken) return false;

      const auth = JSON.parse(authToken).auth;
      if (!auth) return false;

      const userId: string = JSON.parse(authToken).userId;
      if (!userId) return false;

      return [ auth, userId ];
    }

    if (!vals) {
      localStorage.removeItem("authToken")
      return false;
    }

    const auth = vals[0];
    const userId = vals[1];

    return this.get(userId).pipe(
      map(() => {
        if (Date.now() / 1000 - auth < 86400) // If auth older than 86400 seconds (24 hours) returns false
          return auth.userId;
        
        localStorage.removeItem("authToken");
        console.warn("Authentication expired. Auth: "+ auth);
        throw new Error("Authentication expired. Auth: "+ auth);
      })
    );
  }
}
