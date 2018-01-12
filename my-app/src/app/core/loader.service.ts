import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';


export class LoaderService {
  
constructor() {}
  
  isShow : boolean;

  show(){
    this.isShow = true;
  } 
  hide(){
    this.isShow = false;
  }  
}
