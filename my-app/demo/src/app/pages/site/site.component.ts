import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { DataService }       from '../../core/data.service'; 

export function sortByName(a, b) {
  var nameA = a.first_name.toUpperCase(); // ignore upper and lowercase
  var nameB = b.first_name.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  // names must be equal
  return 0;
}

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['../../../assets/ng2-select/ng2-select.css', './site.component.css']
})
export class SiteComponent implements OnInit {

  constructor(
    public router : Router,
    public data :DataService,
  ) { }

  max: number = 5;
  rate: number = 4;
  isReadonly: boolean = true;
  filter:any;

  allTrainers :any[];
  trainers :any[];

  setTrainers(t:number, o?:number){
    if(!o) o = 0;
    this.trainers = this.allTrainers.slice(o,t);
  }

  sortBy(type:string){
    switch(type){
      case 'name':
        this.allTrainers.sort(sortByName);
        break;
    }
    this.setTrainers(this.trainers.length);
  }



  loadMore(){
    this.setTrainers(this.trainers.length + 9);
  }
  
  ngOnInit() {
    let self = this;
    this.data.getTrainers().subscribe(x => {
      self.allTrainers = x;
      self.setTrainers(9);
    });
    
  }

}
