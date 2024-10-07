import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../shared/services/user.service';
import { Student } from '../../shared/interfaces/student';
import { StudentService } from '../../shared/services/student.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { Training } from '../../shared/interfaces/training';
import { TrainingService } from '../../shared/services/training.service';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { NamePipe } from '../../shared/pipes/name.pipe';
import { finalize } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-student-trainings',
  standalone: true,
  imports: [RouterLink, FormsModule, NamePipe,
    MatIconModule, MatInputModule, MatButtonModule, MatCheckboxModule,
    MatTabsModule, MatProgressBarModule, MatCardModule, MatChipsModule],
  templateUrl: './student-trainings.component.html',
  styleUrl: './student-trainings.component.scss'
})
export class StudentTrainingsComponent {
  studentId!: string;
  student?: Student;
  rawTrainings: Training[] = [];
  trainings: Training[][] = [[], [], [], [], [], [], []];
  
  weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  todayWeekDay = new Date().getDay();
  isLoading = false;

  constructor(
    private trainingService: TrainingService,
    private studentService: StudentService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.studentId = this.activatedRoute.snapshot.params['id'];
    if (!this.studentId) this.router.navigate(['/students']);
    this.weekDays[this.todayWeekDay] = this.weekDays[this.todayWeekDay] + " (Hoje)";
    this.getTrainings();
  }

  getTrainings() {
    this.studentService.get(this.studentId).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(student => {
      this.student = student;
      this.trainingService.getAllByStudent(student).subscribe({
        next: trainings => {
          this.rawTrainings = trainings;
          if (!trainings) return;

          trainings.forEach(training => this.trainings[training.weekDay].push(training));
        },
        complete: () => this.isLoading = false
      })
    })
  }

  remove(trainingId: string) {
    this.rawTrainings = [];
    this.trainings = [[], [], [], [], [], [], []];
    this.isLoading = true;
    this.studentService.unregisterTraining(this.studentId, trainingId).subscribe({
      next: () => this.getTrainings(),
      error: error => {
        console.error(error);
        this.isLoading = false;
      }
    });
  }
}
