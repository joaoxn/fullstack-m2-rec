import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StudentInterface } from '../interfaces/student.interface';
import { UserService } from './user.service';
import { StudentDtoInterface } from '../interfaces/student.dto.interface';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  url = `http://localhost:3000/students`;

  constructor(private httpClient: HttpClient, private userService: UserService) { }

  getAll(): Observable<StudentInterface[]> {
    const observables: Observable<StudentInterface>[] = [];

    this.userService.currentUser?.studentsId.forEach(studentId => {
      observables.push(this.httpClient.get<StudentInterface>(`${this.url}/${studentId}`));
    })

    return forkJoin(observables);
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
        if (this.userService.currentUser)
        this.userService.registerStudent(this.userService.currentUser.id, student.id);
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
        if (this.userService.currentUser)
        this.userService.unregisterStudent(this.userService.currentUser.id, id);
        return of(student);
      }), catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      }));
  }
}
