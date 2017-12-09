import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { ApiService }       from './api.service';
import { UtilService }      from './util.service';
import { StorageService }   from './storage.service';

@Injectable()


export class AuthService {

  constructor( 
    private router : Router,
    private api : ApiService,
    private storage : StorageService,
    private util : UtilService

  ) {}


  isLoggedIn:boolean = false;
  user:any;
  
  // store the URL so we can redirect after logging in
  
  login(){
    let self = this;
    this.api.myProfile()
    .then((res)=>{
      if(res.code == 200){
        self.setLoggedUser(res.data);
        self.setLoggedIn();
        self.goHome();
      }
    });
  } 

  logout(){
    this.clearLoggedUser();
    this.clearToken();
    this.resetLoggedIn();
    this.goHome();
  }

  handleAuth(){
    if(this.isTokenValid()){  
      this.user = this.getLoggedUser();
      this.setLoggedIn();
    }else{
      this.clearLoggedUser();
      this.resetLoggedIn();
    }
  }

  setLoggedIn(){
    this.isLoggedIn = true; 
  }

  resetLoggedIn(){
    this.isLoggedIn = false; 
  }

  setLoggedUser(user:any){
    this.user = user;
    this.storage.save('app_user', user);
  }

  getLoggedUser(){
    return this.storage.get('app_user');
  }

  clearLoggedUser(){
    this.storage.clear('app_user');
  }   

  setUserProfile(){
    this.user = this.getLoggedUser();
  }

  setToken(token:string){
    var expireAt = this.util.time('H');
    this.storage.save('access_token', token);
    this.storage.save('expires', expireAt);
  }
  clearToken(){
    this.storage.clear('expires');
    this.storage.clear('app_user');
  }

  isTokenValid(){
    var token = this.storage.get('access_token');
    var expireAt = this.storage.get('expires');
    return (token && expireAt &&  parseInt(expireAt) > this.util.time());
  }

  getToken(token:string){
    this.storage.get('access_token');
  }

  goHome(){
    this.router.navigate(['/']);
  }

  goLogin(){
    this.router.navigate(['login']);
  }
}
