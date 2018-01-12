import { Injectable } from '@angular/core';



@Injectable()

export class StorageService {

  constructor() { }

  save(key : string, data : any ){
  	return localStorage.setItem(key, data);
  }

  get(key : string ){
  	return localStorage.getItem(key);
  }

  clear(key : string){
  	localStorage.removeItem(key);
  }

  isExist(key: string){
  	return localStorage.getItem(key) !== null;
  }
}
