import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../interfaces/student';
import { UserService } from './user.service';
import { StudentDto } from '../interfaces/student.dto';
import { catchError, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { StudentTrainingDto, TrainingDto } from '../interfaces/training.dto';

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
      observables.push(
        this.httpClient.get<Student>(`${this.url}/${studentId}`).pipe(
          tap(() => console.log(`GET API at: ${this.url}/${studentId}`))
        )
      );
    });

    return forkJoin(observables);
  }

  get(id: string): Observable<Student> {
    return this.httpClient.get<Student>(`${this.url}/${id}`).pipe(
      tap(() => console.log(`GET API at: ${this.url}/${id}`)),
      catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      })
    );
  }

  add(student: StudentDto): Observable<Student> {
    return this.httpClient.post<Student>(this.url, student).pipe(
      tap(() => console.log(`POST API at: ${this.url} with Body:`, student)),
      switchMap(student => {
        if (this.userService.currentUser)
          return this.userService
            .registerStudent(this.userService.currentUser.id, student.id)
            .pipe(map(() => student));
        throw new Error(`currentUser is not defined`);
      }), catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      })
    );
  }

  update(id: string, student: StudentDto): Observable<Student> {
    return this.httpClient.put<Student>(`${this.url}/${id}`, student).pipe(
      tap(() => console.log(`PUT API at: ${this.url}/${id} with Body:`, student)),
      catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      })
    );
  }

  delete(id: string): Observable<Student> {
    return this.httpClient.delete<Student>(`${this.url}/${id}`).pipe(
      tap(() => console.log(`DELETE API at: ${this.url}/${id}`)),
      switchMap(student => {
        if (this.userService.currentUser)
          return this.userService.unregisterStudent(this.userService.currentUser.id, id)
            .pipe(map(() => student));
        throw new Error(`currentUser is not defined`);
      }), catchError((error: HttpErrorResponse) => {
        console.error("Http Error:", error.message);
        throw error;
      })
    );
  }

  registerTraining(id: string, trainingDto: StudentTrainingDto): Observable<Student> {
    return this.get(id).pipe(
      map(student => {
        student.trainings?.push(trainingDto);
        return student;
      }),
      switchMap(student => this.update(id, student))
    );
  }

  updateTraining(id: string, trainingId: string, trainingDto: StudentTrainingDto) {
    return this.get(id).pipe(
      map(student=> {
        let index = -1;

        student.trainings?.forEach((student, i) => {
          if (student.trainingId === trainingId)
            index = i;
        });

        if (index === -1) throw new Error("NoSuchEntityError: No training with id: " + trainingId);

        student.trainings[index] = trainingDto;
        return student;
      }),
      switchMap(student => this.update(id, student))
    )
  }

  unregisterTraining(id: string, trainingId: string): Observable<Student> {
    return this.get(id).pipe(
      map(student => {
        let index = -1;

        student.trainings?.forEach((student, i) => {
          if (student.trainingId === trainingId)
            index = i;
        });

        if (index === -1) throw new Error("NoSuchEntityError: No training with id: " + trainingId);

        student.trainings.splice(index, 1);
        return student;
      }),
      switchMap(student => this.update(id, student))
    );
  }



  unregisterAllOfTraining(trainingId: string): Observable<Student[]> {
    return this.getAll().pipe(
      map(students => {
        const changedStudents: Student[] = [];
        students.forEach(student => {
          const index = student.trainings.findIndex(training => training.trainingId === trainingId);
          if (index === -1) return;
          student.trainings.splice(index, 1);
          changedStudents.push(student);
        })
        return changedStudents;
      }),
      switchMap(students => {
        const observables: Observable<Student>[] = [];
        students.forEach(student => observables.push(this.update(student.id, student)));
        return forkJoin(observables);
      })
    );
  }
}
