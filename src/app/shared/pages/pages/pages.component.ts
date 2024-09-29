import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTabsModule} from '@angular/material/tabs';
import { UserInterface } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatTabsModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss'
})
export class PagesComponent {

  constructor(private router: Router) { }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
