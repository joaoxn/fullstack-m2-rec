import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './shared/services/user.service';
import { StudentService } from './shared/services/student.service';
import { TrainingService } from './shared/services/training.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'TrainSys';

  constructor(
    private userService: UserService,
    private studentService: StudentService,
    private trainingService: TrainingService
  ) { }

  ngOnInit(): void {
    // this.trainingService.userId, this.studentService.userId = "0";
    // this.showDatabase()
  }

  showDatabase() {
    console.log(this.userService.getAll());
    console.log(this.studentService.getAll());
    console.log(this.trainingService.getAll());
  }
}
