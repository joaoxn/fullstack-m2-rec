import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
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

  loginFailed = false;
  submit() {
    this.userService.login(this.form.get('email')!.value, this.form.get('password')!.value)
      .subscribe(isSuccess => {
        if (!isSuccess) {
          this.loginFailed = true;
          // alert('E-mail e/ou senha inválidos!');
          // TODO: Show error message in the template
          return;
        }
        alert('Login bem sucedido!');
      });
    // TODO: Navigate to home page or any other desired route
  }
}
