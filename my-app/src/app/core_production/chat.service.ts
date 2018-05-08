import * as io from 'socket.io-client';
import { Injectable, } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthService } 	from './auth.service';
import { StorageService } from './storage.service';
import { ApiService } from './api.service';


@Injectable()
export class ChatService {
     private url = 'http://52.169.249.146:3001';
    //private url = 'http://localhost:3001';
    private socket;

    constructor(private storage:StorageService,private apiService:ApiService) {
       // var senderid=[]
        var  senderid = JSON.parse(this.storage.get('app_user'));
        console.log(senderid);
      if(senderid!=null){
       // io.set('transports': ['websocket']);
        this.socket = io(this.url,{ query:  "id="+senderid.id,'transports': ['websocket']});
     

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
        var getdate = new Date();
        var getnewTime = getdate.getTime();

       this.socket = io(this.url,{ query:  "id="+id,token:getnewTime });
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
    

    public getMessages = () => { console.log('Sumit before Observable')
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