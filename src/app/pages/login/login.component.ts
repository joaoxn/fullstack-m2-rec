import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatProgressBarModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern('.+@.+\\..{2,}')]),
      password: new FormControl('', Validators.required)
    });
  }

  emailErrorMessage(input = <FormControl>this.form.get('email')): string | undefined {
    if (!input.touched) return undefined;

    if (input.hasError('required'))
      return 'E-mail é obrigatório';

    if (input.hasError('pattern') || input.hasError('email'))
      return 'Formato de e-mail inválido';

    return undefined;
  }

  hide = true;
  hideSwitch() {
    this.hide = !this.hide;
  }

  serviceLoading = false;
  globalErrorMessage = "";
  submit() {
    this.serviceLoading = true;
    this.globalErrorMessage = "";
    const defaultUserErrorMessage = "*E-mail e/ou senha inválidos!";
    const defaultServerErrorMessage = "Erro ao efetuar login! Tente novamente mais tarde...";

    const email = this.form.get('email')!.value;
    const password: string = this.form.get('password')!.value;
    // Validators.minLength(8), 
    // Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W_]).{8,}$')
    if (password.length < 8 ||
      !password.match('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W_]).{8,}$')) {
      this.globalErrorMessage = defaultUserErrorMessage;
      this.serviceLoading = false;
      return;
    }

    this.userService.login(email, password)
      .subscribe({
        next: userId => this.router.navigate(['/home']),
        error: (error: Error) => {
          if (
            error.message.slice(0, 18) == "NoSuchEntityError:" ||
            error.message.slice(0, 18) == "UnauthorizedError:"
          ) {
            this.globalErrorMessage = "*E-mail e/ou Senha inválidos!";
            return;
          }
          console.error(error);
          this.globalErrorMessage = defaultServerErrorMessage;
          this.serviceLoading = false;
        }
      });
  }
}
