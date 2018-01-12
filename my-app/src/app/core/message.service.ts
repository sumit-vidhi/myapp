import { Injectable } from '@angular/core';
import { setTimeout } from 'timers';

class Alert{
  type:string;
  text:string;

  constructor(type:string,message:string){
    this.type=type;
    this.text=message;
  }
}

@Injectable()
export class MessageService {

  key = 'alert_message';
  
  success(message:string){
    let alert = new Alert('success',message);
    this.setMessage(alert);
  }
  error(message:string){
    let alert = new Alert('danger',message);
    this.setMessage(alert);
  }
  
  getMessage():any{
    let msg = sessionStorage.getItem(this.key);
    setTimeout(() => this.clearMessage(), 1000);
    return this.toJson(msg);
  }

  private setMessage(alert:Alert){
    sessionStorage.setItem(this.key, this.toStr(alert));
  }

  private clearMessage(){
    sessionStorage.removeItem(this.key);
  }

  private toJson(str:string):any{
    return JSON.parse(str);
  }

  private toStr(obj:any):string{
    return JSON.stringify(obj);
  }
}
