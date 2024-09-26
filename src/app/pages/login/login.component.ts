import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../shared/services/user.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    })
  }

  errorMessage(input: string): string | undefined {
    switch (input) {
      case 'email':
        if (this.form.get('email')?.touched) {
          if (this.form.get('email')?.hasError('required')) {
            return 'E-mail é obrigatório'
          }
          else if (this.form.get('email')?.hasError('email')) {
            return 'Formato de e-mail inválido'
          }
        }
    }
    return undefined;
  }

  hide = true;
  hideSwitch() {
    this.hide = !this.hide;
  }

  globalErrorMessage = "";
  submit() {
    this.globalErrorMessage = "";
    this.userService.login(this.form.get('email')!.value, this.form.get('password')!.value)
      .subscribe({
        next: isSuccess => {
          if (!isSuccess) {
            this.globalErrorMessage = "*E-mail ou Senha inválidos";
            return;
          }
          alert('Login bem sucedido!');
          // TODO: Navigate to home page or any other desired route
        },
        error: error => {
          console.error(error);
          this.globalErrorMessage = "Erro ao tentar efetuar login! Tente novamente mais tarde...";
        }
      });
  }
}
