import { Component, OnInit } from '@angular/core';
import { Router, RouterModule,ActivatedRoute, Params } from '@angular/router';
import { MealserviceService } from '../mealservice.service';
import { BehaviorSubject, Observable } from "rxjs";
@Component({
  selector: 'app-mealsdetail',
  templateUrl: './mealsdetail.component.html',
  styleUrls: ['./mealsdetail.component.css']
})
export class MealsdetailComponent implements OnInit {

  constructor(private route: ActivatedRoute,private mealservice:MealserviceService) { }
 mealId:any;
 mealdetails: Observable<Array<any>>;
 image:Array<number>;
 check:any=true;
 details:boolean;
 ingredients:boolean;
 nutrition:boolean;
  ngOnInit() {
    this.details=true;
    this.ingredients=false;
    this.nutrition=false;
    this.route.params.subscribe(params => {
      //console.log(params) //log the entire params object
      this.mealId=params['id']; //log the value of id
    });
    let id=this.mealId;
    this.getdetails(id);
    this.image=[0];
    
  } 
  getdetails(id:any){
    this.mealservice.getdetails(id).subscribe(result => {this.mealdetails=result,console.log(result)});
  }
  changeimage(id:any){
    this.image=[id];
  }
  changetab(tabs:any){
      if(tabs=="tab1"){
        this.details=true;
        this.ingredients=false;
        this.nutrition=false;
      }else if(tabs=="tab2"){
        this.details=false;
        this.ingredients=true;
        this.nutrition=false;
      }else if(tabs=="tab3"){
        this.details=false;
        this.ingredients=false;
        this.nutrition=true; 
       }
  }


}
