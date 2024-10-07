import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RawTraining, Training } from '../interfaces/training';
import { UserService } from './user.service';
import { TrainingDto } from '../interfaces/training.dto';
import { catchError, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { StudentService } from './student.service';
import { Student } from '../interfaces/student';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  url = `http://localhost:3000/trainings`;

  constructor(
    private httpClient: HttpClient,
    private studentService: StudentService,  // Assuming StudentService is already injected
    private userService: UserService
  ) { }

  getAll(): Observable<RawTraining[]> {
    return this.httpClient.get<RawTraining[]>(this.url).pipe(
      tap(() => console.log(`GET API at: ${this.url}`)),
      catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      })
    );
  }

  getAllByStudent(student: Student): Observable<Training[]> {
    const observables: Observable<Training>[] = [];

    student.trainings?.forEach(trainingData => {
      console.log(`searching training of id ${trainingData.trainingId}`);
      const observable = this.httpClient.get<RawTraining>(`${this.url}/${trainingData.trainingId}`).pipe(
        tap(() => console.log(`GET API at: ${this.url}/${trainingData.trainingId}`)),
        map<RawTraining, Training>(rawTraining => (
          {
            ...rawTraining,
            weekDay: trainingData.weekDay,
            concluded: trainingData.concluded
          }
        ))
      );

      observables.push(observable);
    })

    return forkJoin(observables);
  }

  get(id: string): Observable<RawTraining> {
    return this.httpClient.get<RawTraining>(`${this.url}/${id}`).pipe(
      tap(() => console.log(`GET API at: ${this.url}/${id}`)),
      catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      })
    );
  }

  add(training: TrainingDto): Observable<RawTraining> {
    return this.httpClient.post<RawTraining>(this.url, training).pipe(
      tap(() => console.log(`POST API at: ${this.url} with Body:`, training)),
      switchMap(training => {
        if (this.userService.currentUser)
          return this.userService.registerTraining(this.userService.currentUser.id, training.id)
            .pipe(map(() => training));
        throw new Error(`currentUser is not defined`);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      })
    );
  }

  update(id: string, training: TrainingDto): Observable<RawTraining> {
    return this.httpClient.put<RawTraining>(`${this.url}/${id}`, training).pipe(
      tap(() => console.log(`PUT API at: ${this.url}/${id} with Body:`, training)),
      catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      })
    );
  }

  delete(id: string): Observable<RawTraining> {
    return this.studentService.unregisterAllOfTraining(id).pipe(
      switchMap(students => {

        return this.httpClient.delete<RawTraining>(`${this.url}/${id}`).pipe(
          tap(() => console.log(`DELETE API at: ${this.url}/${id}`)),

          switchMap(training => {
            if (this.userService.currentUser)
              return this.userService.unregisterTraining(this.userService.currentUser.id, id)
                .pipe(map(() => training));
            throw new Error(`currentUser is not defined`);
          }),
          catchError((error: HttpErrorResponse) => {
            console.error("Http Error:", error.message);
            throw error;
          })
        )

      }));
  }
}
