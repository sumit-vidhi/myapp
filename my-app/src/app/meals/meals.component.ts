import { Component, OnInit ,Input} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MealserviceService } from '../mealservice.service';
import {PaginationComponent} from '../pagination/pagination.component';
import { BehaviorSubject, Observable } from "rxjs";
@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css'],
  
})
export class MealsComponent implements OnInit {
  // meals = [];
  plan:any;
  count:any=0;
  remainingmeal:any=0;
  facility:Array<number>=[];
  counter:Array<number>=[];
  result:{};
  error:any="";
  totalRecords: number = 0;
  pageSize: number = 2;
  objectKeys = Object.keys;
  meals: Observable<Array<any>>;

  search:string="all";
  constructor(private router:Router,private mealservice:MealserviceService) { }

  ngOnInit() {
   // let sercah=this.search;
    this.getviewmeal(1,this.search);
  
  }
  pageChanged(objse) {
   
    this.getviewmeal(objse.page,objse.search);
  }

  mealadd(i:any){
   // alert(i);
    let total=this.mealservice.addmeal(i);
    if(this.facility.indexOf(parseInt(i))==-1 &&  this.plan>total){
       this.facility.push(parseInt(i));
    }
   console.log(this.facility);

  }

  mealdown(i:any){
    var counter=this.mealservice.downmeal(i);
      if(counter==0){
        var keys=this.facility.indexOf(parseInt(i))
        this.facility.splice(keys,1);
     }
  }
 getviewmeal(page:number,keys:any){
   keys=(keys==undefined || keys=="")?"all":keys;
  this.search=keys;
    if(window.localStorage.getItem("mealplan")==null){
      this.router.navigate(["/mealplan"]);
    }
    if(window.localStorage.getItem("mealplan")!=null){
      this.plan=window.localStorage.getItem("mealplan");
    }
    this.meals = this.mealservice.meals;
  
    this.mealservice.getmeals(page,keys);
    this.meals.subscribe(result => {this.meals=result[0],this.totalRecords=result[1]});
  //console.log(this.mealservice.getmeals(page));

  }




}
