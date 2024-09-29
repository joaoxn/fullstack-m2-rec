import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../shared/services/user.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule, RouterLink],
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

  globalErrorMessage = "";
  submit() {
    this.globalErrorMessage = "";
    this.userService.login(this.form.get('email')!.value, this.form.get('password')!.value)
      .subscribe({
        next: userId => this.router.navigate(['/home']),
        error: (error: Error) => {
          if (
            error.message.slice(0, 19) == "NoSuchEntityError:" ||
            error.message.slice(0, 19) == "UnauthorizedError:"
          ) {
            this.globalErrorMessage = "*E-mail e/ou Senha inválidos!";
            return;
          }
          console.error(error);
          this.globalErrorMessage = "Erro ao efetuar login! Tente novamente mais tarde...";
        }
      });
  }
}
