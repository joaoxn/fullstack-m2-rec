import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../shared/services/user.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  form!: FormGroup;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      // Name must be at least 2 words with 2+ charaters each
      name: new FormControl('', [Validators.required, Validators.pattern('^(([a-zA-Z]|[à-üÀ-Ü]){2,} )+([a-zA-Z]|[à-üÀ-Ü]){2,} *$')]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern('.+@.+\\..{2,}')]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W_]).{8,}$')]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      plan: new FormControl('bronze', Validators.required)
    })
  }

  errorMessage(inputName: string, inputDisplayName: string): string | undefined {
    const inputControl = <FormControl>this.form.get(inputName);
    if (!inputControl.touched) return undefined;

    if (inputControl.hasError('required'))
      return inputDisplayName + ' é obrigatório';

    switch (inputName) {
      case 'email':
        return this.emailErrorMessage(inputControl);
      case 'name':
        return this.nameErrorMessage(inputControl);
      case 'password':
        return this.passwordErrorMessage(inputControl);
      case 'confirmPassword':
        if (inputControl.hasError('pattern'))
          return 'Senhas não coincidem';
        return undefined;
      default:
        return undefined;
    }
  }

  emailErrorMessage(input = <FormControl>this.form.get('email')): string | undefined {
    if (input.hasError('pattern') || input.hasError('email'))
      return 'Formato de e-mail inválido'
    return undefined;
  }

  nameErrorMessage(input = <FormControl>this.form.get('name')): string | undefined {
    if (input.hasError('pattern'))
      return 'Tem certeza que digitou seu nome corretamente?'

    return undefined;
  }

  passwordErrorMessage(input = <FormControl>this.form.get('password')): string | undefined {
    const value: String = input.value;
    // console.log('Validating password\nInput:', input, '\nValue:', value);
    if (input.hasError('minlength') || input.hasError('maxlength'))
      return 'Senha deve ter entre 8 e 50 caracteres'

    if (input.hasError('pattern')) {
      // Check if string does not contain any lowercase OR if doesn't contain upper case letters
      if (value.match('^(?!.*[a-z]).+$'))
        return 'Deve conter pelo menos uma letra minúscula'

      if (value.match('^(?!.*[A-Z]).+$'))
        return 'Deve conter pelo menos uma letra maiúscula'

      if (value.match('^(?!.*[0-9]).+$'))
        return 'Deve conter pelo menos um número';

      if (value.match('^(?!.*[\\W_]).+$'))
        return 'Deve conter pelo menos um caractere especial';
    }
    return undefined;
  }

  passwordChange() {
    const password = <FormControl>this.form.get('password');
    const confirmPassword = <FormControl>this.form.get('confirmPassword');
    console.log("password changed to:", password.value);

    confirmPassword.setValidators([Validators.required, Validators.pattern(password.value)]);
    confirmPassword.updateValueAndValidity();
  }

  hide = true;
  hideSwitch() {
    this.hide = !this.hide;
  }

  globalErrorMessage = "";
  submit() {
    this.globalErrorMessage = "";

    this.userService.register({
      name: this.form.get('name')!.value,
      email: this.form.get('email')!.value,
      password: this.form.get('password')!.value,
      plan: this.form.get('plan')!.value,
      exercises: [],
      studentsId: [],
      trainingsId: []
    }).subscribe({
      next: user => {
        if (!user)
          return this.globalErrorMessage = "Email já cadastrado. Entre na conta ou cadastre um novo email!"

        alert('Cadastro realizado com sucesso!');
        // TODO: Navigate to login page or any other desired route
        return;
      },
      error: error => {
        console.error(error);
        this.globalErrorMessage = "Erro ao cadastrar-se! Tente novamente mais tarde...";
      }
    });
  }
}
