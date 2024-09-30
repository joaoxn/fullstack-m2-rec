import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTabsModule} from '@angular/material/tabs';
import { NgStyle } from '@angular/common';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [RouterOutlet , NgStyle, RouterLink, MatTabsModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss'
})
export class PagesComponent implements OnInit, AfterViewInit {
  @ViewChild('header') headerElement!: ElementRef;
  @ViewChild('footer') footerElement!: ElementRef;
  
  routerOutletMinHeight!: string;

  constructor(private userService: UserService, private router: Router, private cdRef: ChangeDetectorRef) { }
  
  ngOnInit(): void {
    if (!this.userService.currentUser)
      this.router.navigate(['/login']);
  }

  ngAfterViewInit(): void {
    const headerHeight = this.headerElement.nativeElement.offsetHeight;
    const footerHeight = this.footerElement.nativeElement.offsetHeight;
  
    this.routerOutletMinHeight = `calc(100vh - ${headerHeight}px - ${footerHeight}px)`;

    this.cdRef.detectChanges();
  }

  logout() {
    this.userService.logout();
  }
}
