import * as io from 'socket.io-client';
import { Injectable, } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CNF } from './config';
import { AuthService } 	from './auth.service';
import { StorageService } from './storage.service';
import { ApiService } from './api.service';


@Injectable()
export class ChatService {
     private url = CNF.CHAT;
    //private url = 'http://localhost:3001';
    private socket;

    constructor(private storage:StorageService,private apiService:ApiService) {
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
            console.log(data);
          this.getMessages();
         });
         this.socket.on('request', (data) => {
            console.log(data);
             this.getRequests();
         });
        }else{
            this.socket = io(this.url);
           
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

    public sendacceptrequestsocket(message) {
        console.log(message);
           this.socket.emit('request', message);
           
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

    public getRequests(){
        return Observable.create((observer) => {
            this.socket.on('request', (request) => {
                console.log(request);
                observer.next(request);
            });
        });
    }
}