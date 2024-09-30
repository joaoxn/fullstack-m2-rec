import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInterface } from '../interfaces/user.interface';
import { UserDtoInterface } from '../interfaces/user.dto.interface';
import { catchError, finalize, map, Observable, of, switchMap, throwError } from 'rxjs';
import { error } from 'console';
import { verify } from 'crypto';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly url = 'http://localhost:3000/users';

  currentUser?: UserInterface;
  lastSuccessVerifyTimestamp = 0;

  constructor(private httpClient: HttpClient, private router: Router) { }

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
          throw new Error("NoSuchEntityError: No user found with such email");
        if (users.length > 1)
          console.warn(`Multiple users found with the same email (${email})`, users);
        return users[0];
      })
    );
  }

  // getCurrentUser(): Observable<UserInterface | undefined> {
  //   const validation = this.validateAuth();
  //   if (!validation) {
  //     this.logout();
  //     return of();
  //   }
    
  //   return validation.pipe(
  //     map(user => this.currentUser = user),
  //     catchError(error => {
  //       console.error(error);
  //       console.warn("User not authenticated, redirecting to login page");
  //       this.logout();
  //       return of();
  //     })
  //   );
  // }

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
        if (index != -1) throw new Error("NoSuchEntityError: No student with id: " + studentId);

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
        if (index != -1) throw new Error("NoSuchEntityError: No training with id: " + trainingId);

        user.trainingsId = user.trainingsId.splice(index, 1);
        return user;
      }),
      switchMap(user => {
        if (user) this.update(userId, user).pipe(map(() => user));
        return of(user);
      })
    );
  }

  register(user: UserDtoInterface): Observable<string> {
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

  validateAuth(): Observable<UserInterface> | false {
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
