import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StudentInterface } from '../interfaces/student.interface';
import { UserService } from './user.service';
import { StudentDtoInterface } from '../interfaces/student.dto.interface';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  userId: string = "";
  url = `http://localhost:3000/students`;

  constructor(private httpClient: HttpClient, private userService: UserService) { }

  getAll(): Observable<StudentInterface[] | HttpErrorResponse> {
    return this.httpClient.get<StudentInterface[]>(this.url)
      .pipe(catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        return of(error);
      }));
  }

  get(id: string): Observable<StudentInterface | HttpErrorResponse> {
    return this.httpClient.get<StudentInterface>(`${this.url}/${id}`)
      .pipe(catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        return of(error);
      }));
  }

  add(student: StudentDtoInterface): Observable<StudentInterface | HttpErrorResponse> {
    return this.httpClient.post<StudentInterface>(this.url, student).pipe(
      map(user => {
        this.userService.registerStudent(this.userId, user.id).subscribe();
        return user;
      }), catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        return of(error);
      }));
  }

  update(id: string, student: StudentDtoInterface): Observable<StudentInterface | HttpErrorResponse> {
    return this.httpClient.put<StudentInterface>(`${this.url}/${id}`, student)
      .pipe(catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        return of(error);
      }));
  }

  delete(id: string): Observable<StudentInterface | HttpErrorResponse> {
    this.userService.unregisterStudent(this.userId, id).subscribe();
    return this.httpClient.delete<StudentInterface>(`${this.url}/${id}`)
    .pipe(catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        return of(error);
      }));
  }
}
