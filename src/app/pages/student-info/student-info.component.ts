import { Component, Input, OnInit } from '@angular/core';
import { StudentInterface } from '../../shared/interfaces/student.interface';
import { StudentService } from '../../shared/services/student.service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormField } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxMaskDirective } from 'ngx-mask';
import { HttpClient } from '@angular/common/http';
import { CepResponse } from '../../shared/interfaces/cep.interface';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-student-info',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgxMaskDirective,
    MatFormField, MatButtonModule, MatInputModule, MatIconModule, MatCheckboxModule, MatProgressBarModule],
  templateUrl: './student-info.component.html',
  styleUrl: './student-info.component.scss'
})
export class StudentInfoComponent implements OnInit {
  studentId?: string;
  student?: StudentInterface;
  cepLoading = false;

  form!: FormGroup;

  constructor(
    private studentService: StudentService,
    private httpClient: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, 
        Validators.pattern('^(([a-zA-Z]|[à-üÀ-Ü]){2,} )+([a-zA-Z]|[à-üÀ-Ü]){2,} *$')]),
      email: new FormControl('', this.optionalEmailValidator()),
      contact: new FormControl('', Validators.required),
      birthDate: new FormControl('', this.optionalBirthDateValidator()),
      cep: new FormControl('', [Validators.required, Validators.minLength(8)]),
      street: new FormControl({ value: '', disabled: true }, Validators.required),
      number: new FormControl(undefined, Validators.required),
      noNumber: new FormControl(false),
      district: new FormControl({ value: '', disabled: true }, Validators.required),
      city: new FormControl({ value: '', disabled: true }, Validators.required),
      state: new FormControl({ value: '', disabled: true }, Validators.required),
      complement: new FormControl(''),
    });


    this.studentId = this.activatedRoute.snapshot.params['id'];
    if (!this.studentId) return;

    this.studentService.get(this.studentId).subscribe(student => {
      this.student = student;
      if (!student) return;
      this.form.patchValue({
        name: student.name,
        email: student.email,
        contact: student.contact,
        birthDate: student.birthDate,
        cep: student.address.cep,
        street: student.address.street,
        number: student.address.number,
        noNumber: student.address.number === undefined,
        district: student.address.district,
        city: student.address.city,
        state: student.address.state,
        complement: student.address.complement || '',
      });
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

  updateCep() {
    const cep = this.form.get('cep');
    const cepValue = cep?.value.replace('-', '');
    cep?.patchValue(cepValue);

    const cepApiUrl = "viacep.com.br/ws/";
    if (!cep || cep.invalid) return;

    this.cepLoading = true;
    cep?.disable();

    console.log('called API at endpoint:', `https://${cepApiUrl}${cepValue}/json`)
    this.httpClient.get<CepResponse>(`https://${cepApiUrl}${cepValue}/json`).subscribe(data => {
      this.cepLoading = false;
      cep?.enable();
      if ('erro' in data) {
        console.error('Given CEP does not exist');
        cep.setErrors({requestInvalid: true});
        return;
      }
      this.form.patchValue({
        street: data.logradouro,
        number: data.unidade,
        district: data.bairro,
        city: data.localidade,
        state: data.estado,
        complement: data.complemento
      })
    })
  }

  globalErrorMessage = "";
  submit() {
    this.globalErrorMessage = "";

    const student = {
      name: this.form.get('name')?.value,
      email: this.form.get('email')?.value,
      contact: this.form.get('contact')?.value,
      birthDate: this.form.get('birthDate')?.value,
      address: {
        cep: this.form.get('cep')?.value,
        street: this.form.get('street')?.value,
        number: this.form.get('number')?.value,
        district: this.form.get('district')?.value,
        city: this.form.get('city')?.value,
        state: this.form.get('state')?.value,
        complement: this.form.get('complement')?.value
      }
    }

    if (this.studentId) {
      this.studentService.update(this.studentId, student).subscribe({
        next: () => this.router.navigate(['/students']),
        error: (error) => {
          console.error('Error updating student:', error);
          this.globalErrorMessage = "Error updating student. Please try again later...";
        }
      });
      return;
    }

    this.studentService.add(student).subscribe({
      next: () => this.router.navigate(['/students']),
      error: (error) => {
        console.error('Error creating student:', error);
        this.globalErrorMessage = "Error creating student. Please try again later...";
      }
    })
  }
}
