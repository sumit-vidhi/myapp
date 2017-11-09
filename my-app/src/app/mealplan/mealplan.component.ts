import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MealserviceService } from '../mealservice.service';
@Component({
  selector: 'app-mealplan',
  templateUrl: './mealplan.component.html',
  styleUrls: ['./mealplan.component.css']
})
export class MealplanComponent implements OnInit {
 
  plan:any;
  constructor(private router:Router,private mealserviceService:MealserviceService) { }

  ngOnInit() {
      if(window.localStorage.getItem("mealplan")!=null){
          this.plan=Number(window.localStorage.getItem("mealplan"));
        }else{
          this.plan=7;
        }
  }

  getplan(m:any){
          if(this.plan!=m){
            this.plan=m;
          }else{
            this.plan=0;
          }
      
  }

  saveplan(){
      this.mealserviceService.save(this.plan);
      this.router.navigate(["/meals"]);
  }

}
