import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { UserInterface } from '../../shared/interfaces/user.interface';
import { UserService } from '../../shared/services/user.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [MatIconModule, MatInputModule, MatButtonModule, MatTableModule],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.scss'
})
export class ExercisesComponent implements OnInit {
  user?: UserInterface;
  exercises?: MatTableDataSource<string, MatPaginator>;
  displayedColumns = ["position", "value", "remove"];
  
  // TODO: Implement training usage validation after making training page
  validInput = false;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.user = this.userService.currentUser;
    if (this.user)
      this.exercises = new MatTableDataSource(this.user.exercises);
  }

  inputChange(value: string) {
    this.validInput = value.length >= 3 && value.length <= 30;
  }

  add(value: string) {
    if (!this.user) return;
    this.user.exercises.push(value);
    this.update();
  }

  remove(index: number) {
    if (!this.user) return;
    this.user.exercises.splice(index, 1);
    this.update();
  }

  update() {
    if (!this.user) return;
    this.userService.update(this.user.id, this.user).subscribe();
    
    if (this.exercises)
      this.exercises.data = this.user.exercises;
  }

  redirectHome() {
    this.router.navigate(['/home']);
  }
}
