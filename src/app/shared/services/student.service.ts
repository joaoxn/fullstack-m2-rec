import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../interfaces/student';
import { UserService } from './user.service';
import { StudentDto } from '../interfaces/student.dto';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  url = `http://localhost:3000/students`;

  constructor(private httpClient: HttpClient, private userService: UserService) { }

  getAll(): Observable<Student[]> {
    const observables: Observable<Student>[] = [];

    this.userService.currentUser?.studentsId.forEach(studentId => {
      console.log(`searching student of id ${studentId}`);
      observables.push(this.httpClient.get<Student>(`${this.url}/${studentId}`));
    })

    return forkJoin(observables);
  }

  get(id: string): Observable<Student> {
    return this.httpClient.get<Student>(`${this.url}/${id}`)
      .pipe(catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      }));
  }

  add(student: StudentDto): Observable<Student> {
    return this.httpClient.post<Student>(this.url, student).pipe(
      switchMap(student => {
        if (this.userService.currentUser)
          return this.userService
            .registerStudent(this.userService.currentUser.id, student.id)
            .pipe(map(() => student));
        throw new Error(`currentUser is not defined`);
      }), catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      }))
  }

  update(id: string, student: StudentDto): Observable<Student> {
    return this.httpClient.put<Student>(`${this.url}/${id}`, student)
      .pipe(catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      }));
  }

  delete(id: string): Observable<Student> {
    return this.httpClient.delete<Student>(`${this.url}/${id}`).pipe(
      switchMap(student => {
        if (this.userService.currentUser)
          return this.userService.unregisterStudent(this.userService.currentUser.id, id)
            .pipe(map(() => student));
        throw new Error(`currentUser is not defined`);
      }), catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      }));
  }
}
