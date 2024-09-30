import { Component, OnInit } from '@angular/core';
import { UserInterface } from '../../shared/interfaces/user.interface';
import { UserService } from '../../shared/services/user.service';

import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatChipsModule, MatProgressBarModule, MatButtonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  user?: UserInterface;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.user = this.userService.currentUser;
  }

  redirectStudents() {
    this.router.navigate(['/students']);
  }

  redirectExercises() {
    this.router.navigate(['/exercises']);
  }
}
