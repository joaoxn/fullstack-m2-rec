import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './shared/services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'TrainSys';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.get('7417').subscribe(data => console.log(data));
  }
}
