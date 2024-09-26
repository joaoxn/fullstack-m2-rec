import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TrainingInterface } from '../interfaces/training.interface';
import { UserService } from './user.service';
import { TrainingDtoInterface } from '../interfaces/training.dto.interface';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  userId: string = "";
  url = `http://localhost:3000/trainings`;

  constructor(private httpClient: HttpClient, private userService: UserService) { }

  getAll(): Observable<TrainingInterface[] | HttpErrorResponse> {
    return this.httpClient.get<TrainingInterface[]>(this.url)
    .pipe(catchError((error: HttpErrorResponse) => {
      console.error("Http Error:", error.message);
      return of(error);
    }));
  }

  get(id: string): Observable<TrainingInterface | HttpErrorResponse> {
    return this.httpClient.get<TrainingInterface>(`${this.url}/${id}`)
    .pipe(catchError((error: HttpErrorResponse) => {
      console.error("Http Error:", error.message);
      return of(error);
    }));
  }

  add(training: TrainingDtoInterface): Observable<TrainingInterface | HttpErrorResponse> {
    return this.httpClient.post<TrainingInterface>(this.url, training).pipe(
      map(user => {
        this.userService.registerStudent(this.userId, user.id).subscribe();
        return user;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        return of(error);
      })
    );
  }

  update(id: string, training: TrainingDtoInterface): Observable<TrainingInterface | HttpErrorResponse> {
    return this.httpClient.put<TrainingInterface>(`${this.url}/${id}`, training)
    .pipe(catchError((error: HttpErrorResponse) => {
      console.error("Http Error:", error.message);
      return of(error);
    }));
  }

  delete(id: string): Observable<TrainingInterface | HttpErrorResponse> {
    this.userService.unregisterTraining(this.userId, id).subscribe();
    return this.httpClient.delete<TrainingInterface>(`${this.url}/${id}`)
    .pipe(catchError((error: HttpErrorResponse) => {
      console.error("Http Error:", error.message);
      return of(error);
    }));
  }
}
