import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TrainingInterface } from '../interfaces/training.interface';
import { UserService } from './user.service';
import { TrainingDtoInterface } from '../interfaces/training.dto.interface';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  userId: string = "";
  url = `http://localhost:3000/trainings`;

  constructor(private httpClient: HttpClient, private userService: UserService) { }

  getAll(): TrainingInterface[] | undefined {
    let response: TrainingInterface[] | undefined;
    this.httpClient.get<TrainingInterface[]>(this.url)
    .subscribe(data => response = data);
    return response;
  }

  get(id: string): TrainingInterface | undefined {
    let response: TrainingInterface | undefined;
    this.httpClient.get<TrainingInterface>(`${this.url}/${id}`)
    .subscribe(data => response = data);
    return response;
  }

  add(training: TrainingDtoInterface): TrainingInterface | undefined {
    let response: TrainingInterface | undefined;
    this.httpClient.post<TrainingInterface>(this.url, training)
    .subscribe(data => response = data);

    if (response)
    this.userService.registerStudent(this.userId, response.id);
    return response;
  }

  update(id: string, training: TrainingDtoInterface): TrainingInterface | undefined {
    let response: TrainingInterface | undefined;
    this.httpClient.put<TrainingInterface>(`${this.url}/${id}`, training)
    .subscribe(data => response = data);
    return response;
  }

  delete(id: string): TrainingInterface | undefined {
    let response: TrainingInterface | undefined;
    this.userService.unregisterTraining(this.userId, id);
    this.httpClient.delete<TrainingInterface>(`${this.url}/${id}`).subscribe(data => response = data);
    return response;
  }
}
