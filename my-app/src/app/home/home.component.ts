import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RouterModule }   from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  //Directives:[HeaderComponent,SidebarComponent],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
