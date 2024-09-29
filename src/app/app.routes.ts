import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './shared/guards/auth.guard';
import { PagesComponent } from './shared/pages/pages/pages.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent, canActivate: [authGuard]},
    {path: 'register', component: RegisterComponent, canActivate: [authGuard]},
    {path: '', component: PagesComponent, children: [
    {path: 'home', component: HomeComponent, canActivate: [authGuard]}
    ]},
    {path: 'dashboard', redirectTo: 'home'},
    {path: '**', redirectTo: 'home'}
];
