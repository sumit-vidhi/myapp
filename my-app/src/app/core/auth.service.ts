import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { ApiService }       from './api.service';
import { UtilService }      from './util.service';
import { StorageService }   from './storage.service';
import { ChatService } from './chat.service';


declare function unescape(s:string): string;
@Injectable()


export class AuthService {
  
  isLoggedIn:boolean = false;
  user:any;
  redirectUrl='/';
  isHired=false;
  
  constructor( 
    private router : Router,
    private api : ApiService,
    private storage : StorageService,
    private chatService:ChatService,
    private util : UtilService

  ) {}
  
  // store the URL so we can redirect after logging in
  
  login(){
    let self = this;
    this.api.myProfile()
    .then((res)=>{
      if(res.code == 200){
        self.setLoggedUser(res.data);
        self.chatService.setuser(res.data.id);
        self.chatService.getalluser(res.data.id);	
        this.getTrainers();
        self.setLoggedIn();
        self.goHome();
      }
    });
  } 

  detailpage(){
    let self = this;
    this.api.myProfile()
    .then((res)=>{
      if(res.code == 200){
        self.setLoggedUser(res.data);
        self.chatService.setuser(res.data.id);
        self.chatService.getalluser(res.data.id);	
        this.getTrainers();
        self.setLoggedIn();
        self.router.navigate([window.localStorage.getItem("detail")]);	
      }
    });
  } 

  updateProfile(){
    let self = this;
    this.api.myProfile()
    .then((res)=>{
      if(res.code == 200){
        self.setLoggedUser(res.data);
        self.setLoggedIn();
        this.user = this.getLoggedUser();
      }
    });
  }


  logout(){
    let self = this;
    self.handleAuth();
    let _user = this.storage.get('app_user');
    var userId=  JSON.parse(_user).id;
    self.api.logout().then(function(res){
      if(res.code === 200){
        self.chatService.unsetuser(userId);
        self.clearLoggedUser();
        self.clearToken();
        self.resetLoggedIn();
        self.goHome();
      }
    })
  }

  handleAuth(){
    console.log(222222222);
    if(this.isTokenValid()){  
      this.user = this.getLoggedUser();
      this.setLoggedIn();
      this.getTrainers();
      this.updateProfile();
    }else{
    
      this.getTrainers();
      this.clearLoggedUser();
      this.resetLoggedIn();
    }
  }

  getTrainers(){
    console.log(321321312);
    let self = this;
    this.api.getHiredTrainers()
    .then(function(res){
      console.log(res);
      if(res.message=='Trainers List'){
        self.isHired = res.data.length>0;
    }
     
      if(res.message=="User not found"){
      //  console.log("hello");
          self.clearToken();
          window.location.href="/login";
      }
    })
    .catch(function(err){
    });
  }

  setLoggedIn(){
    this.isLoggedIn = true; 
  }

  resetLoggedIn(){
    this.isLoggedIn = false; 
  }

  setLoggedUser(user:any){
   // console.log(user);
    user.first_name=unescape(user.first_name);
    user.last_name=unescape(user.last_name);
    this.user = user;
    this.storage.save('app_user', JSON.stringify(user));
  }

  getLoggedUser(){
    let _user = this.storage.get('app_user');
    if(_user) return JSON.parse(_user);
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
    this.storage.clear('access_token');
    this.storage.clear('expires');
    this.storage.clear('app_user');
    this.user="";
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
    console.log(this.user);
    if(this.user.approve=='comment'){
      this.router.navigate(['/account']);
    }else{
      this.router.navigate(['/']);
    }
   
  }

  goLogin(){
    this.router.navigate(['login']);
  }
}
