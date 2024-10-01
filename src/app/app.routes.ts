import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './shared/guards/auth.guard';
import { PagesComponent } from './shared/pages/pages/pages.component';
import { ExercisesComponent } from './pages/exercises/exercises.component';
import { StudentsComponent } from './pages/students/students.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent, canActivate: [authGuard]},
    {path: 'register', component: RegisterComponent, canActivate: [authGuard]},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: '', component: PagesComponent, children: [
        {path: 'home', component: HomeComponent, canActivate: [authGuard]},
        {path: 'exercises', component: ExercisesComponent, canActivate: [authGuard]},
        {path: 'students', component: StudentsComponent, canActivate: [authGuard]}
    ]},
    {path: 'dashboard', redirectTo: 'home'},
    {path: '**', redirectTo: 'home'}
];
