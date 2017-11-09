import { Component,ElementRef, OnInit } from '@angular/core';
import { RouterModule,Router }   from '@angular/router';
import { LoginserviceService } from '../loginservice.service';

import 'rxjs/add/operator/map';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user:any = {};
  error:any="";
  constructor(private router:Router,public authService:LoginserviceService) { 
    
  }

  ngOnInit() {
     if(localStorage.getItem('token')!=null){
      this.router.navigate(["/home"]);
     }
  }

  home(user){
     this.authService.login(user).subscribe((data) => {
     this.router.navigate(["/home"]);
  },
  error => {
     this.error="Username and password is incorrect";
  });
   
 }



}
