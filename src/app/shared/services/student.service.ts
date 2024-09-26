import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StudentInterface } from '../interfaces/student.interface';
import { UserService } from './user.service';
import { StudentDtoInterface } from '../interfaces/student.dto.interface';
import { catchError, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  userId: string = "";
  url = `http://localhost:3000/students`;

  constructor(private httpClient: HttpClient, private userService: UserService) { }

  getAll(): Observable<StudentInterface[]> {
    return this.httpClient.get<StudentInterface[]>(this.url)
      .pipe(catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      }));
  }

  get(id: string): Observable<StudentInterface> {
    return this.httpClient.get<StudentInterface>(`${this.url}/${id}`)
      .pipe(catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      }));
  }

  add(student: StudentDtoInterface): Observable<StudentInterface> {
    return this.httpClient.post<StudentInterface>(this.url, student).pipe(
      switchMap(student => {
        this.userService.registerStudent(this.userId, student.id);
        return of(student);
      }), catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      }))
  }

  update(id: string, student: StudentDtoInterface): Observable<StudentInterface> {
    return this.httpClient.put<StudentInterface>(`${this.url}/${id}`, student)
      .pipe(catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      }));
  }

  delete(id: string): Observable<StudentInterface> {
    return this.httpClient.delete<StudentInterface>(`${this.url}/${id}`).pipe(
      switchMap(student => {
        this.userService.unregisterStudent(this.userId, id);
        return of(student);
      }), catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      }));
  }
}
