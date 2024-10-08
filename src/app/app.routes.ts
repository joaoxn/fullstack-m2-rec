import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './shared/guards/auth.guard';
import { PagesComponent } from './shared/pages/pages/pages.component';
import { ExercisesComponent } from './pages/exercises/exercises.component';
import { StudentsComponent } from './pages/students/students.component';
import { StudentInfoComponent } from './pages/student-info/student-info.component';
import { TrainingsComponent } from './pages/trainings/trainings.component';
import { StudentTrainingsComponent } from './pages/student-trainings/student-trainings.component';
import { dataAccessGuard } from './shared/guards/data-access.guard';

export const routes: Routes = [
    {path: 'login', component: LoginComponent, canActivate: [authGuard]},
    {path: 'register', component: RegisterComponent, canActivate: [authGuard]},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: '', component: PagesComponent, canActivate: [authGuard], children: [
        {path: 'home', component: HomeComponent},
        {path: 'exercises', component: ExercisesComponent},
        {path: 'students', component: StudentsComponent},
        {path: 'students/new', component: StudentInfoComponent},
        {path: 'students/:id', component: StudentInfoComponent, canActivate: [dataAccessGuard]},
        {path: 'students/:id/trainings', component: StudentTrainingsComponent, canActivate: [dataAccessGuard]},
        {path: 'students/:id/trainings/:trId', component: TrainingsComponent, canActivate: [dataAccessGuard]}
    ]},
    {path: '**', redirectTo: 'home'}
];
