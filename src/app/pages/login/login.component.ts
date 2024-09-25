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
            return 'Email is required'
          }
          else if (this.form.get('email')?.hasError('email')) {
            return 'Invalid email format'
          }
        }
    }
    return undefined;
  }

  hide = true;
  hideSwitch() {
    this.hide = !this.hide;
  }

  submit() {
    // TODO: Integrate with userService login method when created
    // const success = this.userService.login(this.form.get('email')!.value, this.form.get('password')!.value);
    // if (!success) {
      alert('E-mail ou senha inválidos!');
      // TODO: Show error message in the template
      return;
    // }
    // TODO: Navigate to home page or any other desired route
  }
}
