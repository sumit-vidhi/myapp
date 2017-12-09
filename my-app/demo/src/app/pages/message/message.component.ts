import { 
  Component, 
  Directive, 
  AfterViewInit, 
  OnInit, 
  ViewChild,
  EventEmitter  
}                           from '@angular/core';

import { Observable }       from 'rxjs/Observable';

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
export function filterByName(a, b) {
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
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})



export class MessageComponent implements AfterViewInit{

  constructor(public data : DataService) { }

  allTrainers :any[];
  trainers :any[];

  search(event){
    let term = event.target.value;
    if(term.trim() !== ''){
      let patt = new RegExp('^'+term, 'i');
      console.log(patt)
      this.trainers = this.allTrainers.filter(x => patt.test(x.first_name)).slice(0,5);
      this.trainers.sort(sortByName);
    }  
  }

  setTrainers(t:number, o?:number){
    if(!o) o = 0;
    this.trainers = this.allTrainers.slice(o,t);
  }
  
  ngOnInit() {
    let self = this;
    this.data.getTrainers().subscribe(x => {
      self.allTrainers = x;
      self.setTrainers(5);
    });
    
  }

  ngAfterViewInit() {
    (<any>$(".content")).mCustomScrollbar();
  }

}
