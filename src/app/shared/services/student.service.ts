import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentInterface } from '../interfaces/student.interface';
import { UserService } from './user.service';
import { StudentDtoInterface } from '../interfaces/student.dto.interface';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  userId: string = "";
  url = `http://localhost:3000/students`;

  constructor(private httpClient: HttpClient, private userService: UserService) { }

  getAll(): StudentInterface[] | undefined {
    let response: StudentInterface[] | undefined;
    this.httpClient.get<StudentInterface[]>(this.url)
    .subscribe(data => response = data);
    return response;
  }

  get(id: string): StudentInterface | undefined {
    let response: StudentInterface | undefined;
    this.httpClient.get<StudentInterface>(`${this.url}/${id}`)
    .subscribe(data => response = data);
    return response;
  }

  add(student: StudentDtoInterface): StudentInterface | undefined {
    let response: StudentInterface | undefined;
    this.httpClient.post<StudentInterface>(this.url, student)
    .subscribe(data => response = data);

    if (response)
    this.userService.registerStudent(this.userId, response.id);
    return response;
  }

  update(id: string, student: StudentDtoInterface): StudentInterface | undefined {
    let response: StudentInterface | undefined;
    this.httpClient.put<StudentInterface>(`${this.url}/${id}`, student)
      .subscribe(data => response = data);
      return response;
  }

  delete(id: string): StudentInterface | undefined {
    let response: StudentInterface | undefined;
    this.userService.unregisterStudent(this.userId, id);
    this.httpClient.delete<StudentInterface>(`${this.url}/${id}`).subscribe(data => response = data);
    return response;
  }
}
