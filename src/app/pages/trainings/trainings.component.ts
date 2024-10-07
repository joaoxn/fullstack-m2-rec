import { Component, Input, OnInit } from '@angular/core';
import { RawTraining, Training } from '../../shared/interfaces/training';
import { TrainingService } from '../../shared/services/training.service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormField } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxMaskDirective } from 'ngx-mask';
import { HttpClient } from '@angular/common/http';
import { CepResponse } from '../../shared/interfaces/cep';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TrainingDto } from '../../shared/interfaces/training.dto';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgxMaskDirective,
    MatFormField, MatButtonModule, MatInputModule, MatIconModule,
    MatCheckboxModule, MatProgressBarModule, MatSelectModule],
  templateUrl: './trainings.component.html',
  styleUrl: './trainings.component.scss'
})
export class TrainingsComponent {
  trainingId?: string;
  studentId?: string;
  training?: Training;
  exercises!: string[];

  noExercisesError = false;

  form!: FormGroup;
  globalErrorMessage = "";
  loading = false;

  constructor(
    private trainingService: TrainingService,
    private userService: UserService,
    private httpClient: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      exercise: new FormControl('', Validators.required),
      repetitions: new FormControl(undefined, [Validators.required, Validators.min(1)]),
      weight: new FormControl(undefined, Validators.required),
      pauseTime: new FormControl(undefined, Validators.required),
      observations: new FormControl(''),
      weekDay: new FormControl(new Date().getDay(), Validators.required)
    });

    this.exercises = this.userService.currentUser?.exercises || [];
    if (this.exercises.length === 0) {
      this.noExercisesError = true;
      this.form.disable();
    }

    this.trainingId = this.activatedRoute.snapshot.params['trId'];
    this.studentId = this.activatedRoute.snapshot.params['id'];
    if (!this.studentId) {
      this.router.navigate(['/home']);
      return;
    }

    if (this.trainingId === 'new') {
      this.trainingId = undefined;
    }

    if (this.trainingId) {
      this.trainingService.getFull(this.trainingId, this.studentId).subscribe({
        next: training => {
        this.training = training;
        if (!training) return;
        console.log('Got training:', training)
        if (!this.userService.currentUser?.exercises.includes(training.exercise)) {
          training.exercise = '';
        }
        this.form.patchValue({
          exercise: this.training.exercise,
          repetitions: this.training.repetitions,
          weight: this.training.weight,
          pauseTime: this.training.pauseTime,
          observations: this.training.observations,
          weekDay: this.training.weekDay
        });
      },
      error: error => {
        console.warn("Could not get specified training. Set as create training mode.", error);
        this.trainingId = undefined;
      }
    });
    }
  }

  submit() {
    this.globalErrorMessage = "";
    this.loading = true;
    this.form.disable();

    const training: TrainingDto = {
      exercise: this.form.get('exercise')?.value,
      repetitions: this.form.get('repetitions')?.value,
      weight: this.form.get('weight')?.value,
      pauseTime: this.form.get('pauseTime')?.value,
      observations: this.form.get('observations')?.value,
      weekDay: this.form.get('weekDay')?.value,
      concluded: this.training?.concluded || false
    }
    if (!this.studentId) {
      this.globalErrorMessage = 'Houve um erro em identificar o Aluno. Por favor, volte a página anterior e tente novamente';
      this.loading = false;
      this.form.enable();
      return;
    }

    if (this.trainingId) {
      this.trainingService.updateFull(this.trainingId, this.studentId, training).subscribe({
        next: () => this.router.navigate(['/students', this.studentId, 'trainings']),
        error: (error) => {
          console.error('Error updating training:', error);
          this.globalErrorMessage = "Error updating training. Please try again later...";
          this.loading = false;
          this.form.enable();
        }
      });
      return;
    }

    this.trainingService.addFull(this.studentId, training).subscribe({
      next: () => this.router.navigate(['/students', this.studentId, 'trainings']),
      error: (error) => {
        console.error('Error creating training:', error);
        this.globalErrorMessage = "Error creating training. Please try again later...";
        this.loading = false;
        this.form.enable();
      }
    })
  }
}
