import { Component, Input, OnInit } from '@angular/core';
import { StudentInterface } from '../../shared/interfaces/student.interface';
import { StudentService } from '../../shared/services/student.service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { MatFormField } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-student-info',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective,
    MatFormField, MatButtonModule, MatInputModule, MatIconModule, MatCheckboxModule],
  templateUrl: './student-info.component.html',
  styleUrl: './student-info.component.scss'
})
export class StudentInfoComponent implements OnInit {
  studentId!: string;
  student?: StudentInterface;

  form!: FormGroup;

  constructor(
    private studentService: StudentService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.studentId = this.activatedRoute.snapshot.params['id'];
    if (this.studentId) {
      this.studentService.get(this.studentId).subscribe(student => this.student = student);
    }

    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', this.optionalEmailValidator()),
      contact: new FormControl('', Validators.required),
      birthDate: new FormControl('', this.optionalBirthDateValidator()),
      cep: new FormControl('', { validators: Validators.required }),
      street: new FormControl({ value: '', disabled: true }, Validators.required),
      number: new FormControl(undefined, Validators.required),
      noNumber: new FormControl(false),
      district: new FormControl({ value: '', disabled: true }, Validators.required),
      city: new FormControl({ value: '', disabled: true }, Validators.required),
      state: new FormControl({ value: '', disabled: true }, Validators.required),
      complement: new FormControl(''),
    });
  }

  optionalEmailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
  
      const emailError = Validators.email(control);
      const patternError = Validators.pattern('.+@.+\\..{2,}')(control);
  
      return emailError || patternError ? { invalid: true } : null;
    };
  }

  optionalBirthDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
  
      const timestamp = Date.parse(control.value);
      if (isNaN(timestamp)) return { dateInvalid: true };
  
      const diffTime = (Date.now() - timestamp) / 1000;
      const ageInSeconds = 140 * 365 * 24 * 60 * 60;
  
      // Check if the date is beyond a reasonable range (140 years old) or in the future
      return diffTime > ageInSeconds || diffTime < 0 ? { invalid: true } : null;
    };
  }  

  houseNumberChange() {
    const numberInput = this.form.get('number');
    if (this.form.get('noNumber')?.value)
      numberInput?.disable();
    else
      numberInput?.enable();
  }

  globalErrorMessage = "";
  save() {
    this.globalErrorMessage = "";
  }

  redirectHome() {
    this.router.navigate(['/home']);
  }
}
