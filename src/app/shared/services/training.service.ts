import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Training } from '../interfaces/training';
import { UserService } from './user.service';
import { TrainingDto } from '../interfaces/training.dto';
import { catchError, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  userId: string = "";
  url = `http://localhost:3000/trainings`;

  constructor(private httpClient: HttpClient, private userService: UserService) { }

  getAll(): Observable<Training[]> {
    return this.httpClient.get<Training[]>(this.url)
    .pipe(catchError((error: HttpErrorResponse) => {
      console.error("Http Error:", error.message);
      throw error;
    }));
  }

  get(id: string): Observable<Training> {
    return this.httpClient.get<Training>(`${this.url}/${id}`)
    .pipe(catchError((error: HttpErrorResponse) => {
      console.error("Http Error:", error.message);
      throw error;
    }));
  }

  add(training: TrainingDto): Observable<Training> {
    return this.httpClient.post<Training>(this.url, training).pipe(
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

  update(id: string, training: TrainingDto): Observable<Training> {
    return this.httpClient.put<Training>(`${this.url}/${id}`, training)
    .pipe(catchError((error: HttpErrorResponse) => {
      console.error("Http Error:", error.message);
      throw error;
    }));
  }

  delete(id: string): Observable<Training> {
    return this.httpClient.delete<Training>(`${this.url}/${id}`).pipe(
      switchMap(training => {
        this.userService.unregisterTraining(this.userId, id);
        return of(training);
      }), catchError((error: HttpErrorResponse) => {
      console.error("Http Error:", error.message);
      throw error;
    }));
  }
}
