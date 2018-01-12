import * as io from 'socket.io-client';
import { Injectable, } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthService } 	from './auth.service';
import { StorageService } from './storage.service';


@Injectable()
export class ChatService {
    private url = 'http://52.169.75.115:3001';
    private socket;

    constructor(private storage:StorageService) {
       // var senderid=[]
        var  senderid = JSON.parse(this.storage.get('app_user'));
        console.log(senderid);
      if(senderid!=null){

        this.socket = io(this.url,{ query:  "id="+senderid.id});
     

        this.socket.on('users', (data) => {
            console.log(data);  
          this.getusers();
         });
         this.socket.on('message', (data) => {
            // console.log(data);
          this.getMessages();
         });
        }
         
    }
  
     
    public getalluser(id:any){
        this.socket = io(this.url,{ query:  "id="+id});
        this.socket.on('users', (data) => {
            console.log(data);  
          this.getusers();
         });
     }
 
   
    public setuser(id:any){
       this.socket = io(this.url,{ query:  "id="+id});
    }

    public unsetuser(id:any){
        this.socket = io(this.url,{ query:  "id="+id});
        this.socket.emit('logout', id);
     }
 

    getusers(){
        return Observable.create((observer) => {
            this.socket.on('users', (data) => {
                console.log(data);
                observer.next(data);
            });
        });
    }

    public sendMessagesocket(message) {
     console.log(message);
        this.socket.emit('message', message);
        
       // this.getMessages();
    }
    

    public getMessages = () => {
        return Observable.create((observer) => {
            this.socket.on('message', (message) => {
                console.log(message);
                observer.next(message);
            });
        });
    }
}