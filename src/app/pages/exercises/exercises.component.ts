import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.scss'
})
export class ExercisesComponent {

  constructor(private router: Router) { }

  redirectHome() {
    this.router.navigate(['/home']);
  }
}
