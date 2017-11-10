import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class MealserviceService  {
  meals: Observable<Array<any>>;
  private _meals: BehaviorSubject<any>;
  count:any=0;
  plan:any= window.localStorage.getItem("mealplan");
  private dataStore: {
    meals:Array<any>;
    mealsdata:Array<any>;
    total:Array<any>;

  };
  
  constructor (
    private http: Http
  ) {
    this.mealsdata.next(this.plan);
    this.dataStore = { meals:[],mealsdata:[[]],total:[]};
    this._meals =new BehaviorSubject([]);
    this.meals = this._meals.asObservable();
 
 
  }
  
  mealsdata = new BehaviorSubject<any>(0);
  mealsobserve() : Observable<any> {
    return this.mealsdata.asObservable();
  }
  mealspendigdata = new BehaviorSubject<any>(0);
  mealspendingobserve() : Observable<any> {
    return this.mealspendigdata.asObservable();
  }

  getmeals(page,keys) {
    return this.http.get(`http://localhost:4300/showdata/`+page+'/'+keys)
    .map(response => response.json()).subscribe(data => {
      this.dataStore.meals[0] = data.res;
      this.dataStore.meals[1] = data.total;
   
    // this.dataStore.meals[0]={};
     
      for(let vals of data.res){
        this.dataStore.mealsdata[0][vals.id]=vals;
      }
      this._meals.next(this.dataStore.meals);
     //s console.log(this.dataStore.meals[0]);
    }, error => console.log('Could not load Meals.'));;
  }

  getdetails(page) {
    return this.http.get(`http://localhost:4300/meal/`+page)
    .map(response => response.json());
  }


  addmeal(i:any){
    console.log(this.dataStore.mealsdata);
   let totalcounter=this.getaddmeals();
   totalcounter=(totalcounter)?totalcounter+1:1;
   //console.log(totalcounter);
   if(this.plan>=totalcounter){
    this._meals.value[0][i].counter=(this._meals.value[0][i].counter)?this._meals.value[0][i].counter+1:1;
    let pendingmeal=this.plan-Number(totalcounter);
    this.mealspendigdata.next(pendingmeal);
   }
  
   window.localStorage.setItem("meals", this._meals.value[0][i]);
  // console.log(window.localStorage.getItem("meals"));
    return totalcounter;
  }
  getaddmeals(){
    let counter=0;
   for(let ranage of this._meals.value[0]){
     if(ranage.counter!=undefined){
     counter+=Number(ranage.counter);
     }
   }
   return Number(counter);

  }

  downmeal(i:any){
    this._meals.value[0][i].counter=(this._meals.value[0][i].counter)?this._meals.value[0][i].counter-1:0;
    let totalcounter=this.getaddmeals();
    if(totalcounter>=0){
    let pendingmeal=Number(this.plan)-totalcounter;
    this.mealspendigdata.next(pendingmeal);
    
    }
    window.localStorage.setItem("meals", this._meals.value[0]);
  return totalcounter;
  }

  save(plan:any){
    window.localStorage.setItem("mealplan",plan);
    this.mealsdata.next(plan);
  }

}

