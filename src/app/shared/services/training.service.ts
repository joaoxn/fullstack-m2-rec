import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TrainingInterface } from '../interfaces/training.interface';
import { UserService } from './user.service';
import { TrainingDtoInterface } from '../interfaces/training.dto.interface';
import { catchError, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  userId: string = "";
  url = `http://localhost:3000/trainings`;

  constructor(private httpClient: HttpClient, private userService: UserService) { }

  getAll(): Observable<TrainingInterface[]> {
    return this.httpClient.get<TrainingInterface[]>(this.url)
    .pipe(catchError((error: HttpErrorResponse) => {
      console.error("Http Error:", error.message);
      throw error;
    }));
  }

  get(id: string): Observable<TrainingInterface> {
    return this.httpClient.get<TrainingInterface>(`${this.url}/${id}`)
    .pipe(catchError((error: HttpErrorResponse) => {
      console.error("Http Error:", error.message);
      throw error;
    }));
  }

  add(training: TrainingDtoInterface): Observable<TrainingInterface> {
    return this.httpClient.post<TrainingInterface>(this.url, training).pipe(
      switchMap(training => {
        this.userService.registerTraining(this.userId, training.id);
        return of(training);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      })
    );
  }

  update(id: string, training: TrainingDtoInterface): Observable<TrainingInterface> {
    return this.httpClient.put<TrainingInterface>(`${this.url}/${id}`, training)
    .pipe(catchError((error: HttpErrorResponse) => {
      console.error("Http Error:", error.message);
      throw error;
    }));
  }

  delete(id: string): Observable<TrainingInterface> {
    return this.httpClient.delete<TrainingInterface>(`${this.url}/${id}`).pipe(
      switchMap(training => {
        this.userService.unregisterTraining(this.userId, id);
        return of(training);
      }), catchError((error: HttpErrorResponse) => {
      console.error("Http Error:", error.message);
      throw error;
    }));
  }
}
