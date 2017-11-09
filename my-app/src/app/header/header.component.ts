import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { RouterModule,Router }   from '@angular/router';
import { LoginserviceService } from '../loginservice.service';
import { MealserviceService } from '../mealservice.service';
//import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn : Observable<boolean>;
  meals : Observable<any>;
  pendingmeals : Observable<any>;
  constructor(private router:Router,
             public authService:LoginserviceService,
             public mealserviceService:MealserviceService) {
  
   }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    let subscription = this.mealserviceService.mealsobserve().subscribe((meals) => this.meals = meals);
    this.mealserviceService.mealspendingobserve().subscribe((pendingmeals) => this.pendingmeals = pendingmeals);
  }


  logout(){
    this.authService.logout();
    this.router.navigate(["/"]);
  }

}
