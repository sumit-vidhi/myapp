import { 
  Component,
  OnInit ,
  HostListener
}                           from '@angular/core';

import { Inject, ViewChild,  ElementRef } from '@angular/core';
import { DOCUMENT} from '@angular/common';
import { Observable }       from 'rxjs/Observable';

import { ApiService }       from '../../core/api.service'; 
import { ChatService }       from '../../core/chat.service';

import { Router,ActivatedRoute }            from '@angular/router';
import { AuthService } 	from '../../core/auth.service'; 

import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
export function sortByName(a, b) {
  var nameA = a.name.toUpperCase(); // ignore upper and lowercase
  var nameB = b.name.toUpperCase(); // ignore upper and lowercase
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
  var nameA = a.name.toUpperCase(); // ignore upper and lowercase
  var nameB = b.name.toUpperCase(); // ignore upper and lowercase
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
  selector: 'app-trainer-list',
  templateUrl: './trainer-list.component.html',
  styleUrls: ['./trainer-list.component.css']
 
})

export class TrainerListComponent implements OnInit {

  
  constructor(public api : ApiService,public chatservice:ChatService,
    private pageScrollService: PageScrollService,
    public auth : AuthService,
    public router : Router, 
		@Inject(DOCUMENT) private document: any) { }
  
    hiredTrainers :any[];
    trainersdata :any[];
    trainers :Array<any>=[];
    activeTrainer : any;
    payment : any;
    users:Array<any>=[];
    setting:any;
    counter:any;
    duration:any=0;
    // @HostListener('document:click', ['$event'])
    assignCopy(){
      this.trainersdata = Object.assign([], this.trainers);
     // this.trainersdata[0].counter=0;
    }
     public documentClick(event: Event): void {
      if(this.duration>720000){
        this.chatservice.setuser(this.auth.user.id);
       }
    }
  
    search(event){
          let term = event.target.value;
          // this.duration=0;
          // this.chatservice.setuser(this.auth.user.id);
          if(term.trim() !== ''){
            let patt = new RegExp('^'+term, 'i');
            this.trainersdata = Object.assign([], this.trainers).filter(
              item => item.name.toLowerCase().indexOf(term.toLowerCase()) > -1
          )
          }else{
            this.assignCopy();
          }  
    }

    handleKeyboardEvents(event: KeyboardEvent) {
     if(this.duration>720000){
      this.chatservice.setuser(this.auth.user.id);
     }
     
  }
    
    setActiveTrainer(tId?:number){
      if(this.duration>720000){
        this.chatservice.setuser(this.auth.user.id);
       }
          if(tId!=null){
            this.trainersdata[tId].counter=0;
            this.activeTrainer = this.hiredTrainers[tId];
         
            this.payment=this.hiredTrainers[tId].payment;
          }else{
            this.activeTrainer = this.hiredTrainers[0];
            this.payment=this.hiredTrainers[0].payment;
          } 
          console.log(this.activeTrainer);    
          console.log(this.payment);  
    }

    getTrainers(){
      // this.duration=0;
      // this.chatservice.setuser(this.auth.user.id);
          let self = this;
          this.chatservice.getusers().
              subscribe(data=>{ if (data) { 
                    this.users=[];  
                    this.users.push(data);
                    self.onlinedata();
                }
          })
          this.api.getHiredTrainers()
              .then(function(res){
                if(res.code==200){
                  self.hiredTrainers = res.data;
                  self.setting=res.message_setting;
                  self.setActiveTrainer();
                  self.onlinedata();
                }else{
                  if(res.message=="user_not"){
                    self.auth.logout();
                 }
                }
               
              })
          .catch(function(err){
          });
          self.goToSearch();
    }

    
    
    public goToSearch(): void {
      let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#trainer');
      this.pageScrollService.start(pageScrollInstance);
      }; 

    socketdelte(id){
      console.log(id);
        this.chatservice.unsetuser(id);
    }
    ngOnInit() {
      this.auth.handleAuth();
      if(this.auth.user.role=='2' && (this.auth.user.approve=='comment' || this.auth.user.approve=='' ||  this.auth.user.approve==null)){
        this.router.navigate(['/account']);
      }
     
      let self = this;
      setInterval(function(){
        self.duration=self.duration+1;
        var mins=12*60*1000;
        if(self.duration>mins){
           self.socketdelte(self.auth.user.id);
        }
      },1000)
    
      this.getTrainers();
      var j=0;
      this.chatservice.getMessages().subscribe(data=>{ if (data) { 
            if( self.activeTrainer.id!=data.sender_id){
                for(var i in this.hiredTrainers){
                      if(this.hiredTrainers[i].id==data.sender_id){
                          if(this.hiredTrainers[i].counter===undefined){
                            this.hiredTrainers[i].counter=1;
                          }else{
                            this.hiredTrainers[i].counter=  this.hiredTrainers[i].counter+1;
                          }
                          this.trainers=this.hiredTrainers;
                          this.assignCopy();
                      }
                }
            }else if(self.activeTrainer.id==data.sender_id){
                  var formdata={user_id:data.sender_id,reciver_id:data.recipient_id};
                  this.api.updatemessagetime(formdata)
                  .then(function(){
                  
                  })
                  .catch(function(err){
                  });
            }
          } 
      })
     
 }



 onlinedata(){
      this.trainers=[];
      if(this.hiredTrainers){
        console.log(this.users);
        for(var i in this.hiredTrainers){
            if(this.users.length==0){
              // if(this.hiredTrainers[i].availblity=='Unavailble'){
              //   this.hiredTrainers[i].isOnline=0;
              //   this.trainers.push(this.hiredTrainers[i]);
              // }else if(this.hiredTrainers[i].availblity=='Do not Disturb'){
              //   this.hiredTrainers[i].isOnline=2;
              //   this.trainers.push(this.hiredTrainers[i]);
              // }else{
              //   this.hiredTrainers[i].isOnline=1;
              //   this.trainers.push(this.hiredTrainers[i]);
              // }
              this.trainers.push(this.hiredTrainers[i]);
            }else{
                if(this.hiredTrainers[i].id!=""){
                      if(this.checkvalue(this.hiredTrainers[i].id,this.users)){
                        if(this.hiredTrainers[i].availblity=='Unavailble'){
                          this.hiredTrainers[i].isOnline=0;
                          this.trainers.push(this.hiredTrainers[i]);
                        }else if(this.hiredTrainers[i].availblity=='Do not Disturb'){
                          this.hiredTrainers[i].isOnline=2;
                          this.trainers.push(this.hiredTrainers[i]);
                        }else{
                          this.hiredTrainers[i].isOnline=1;
                          this.trainers.push(this.hiredTrainers[i]);
                        }
                      }else{
                        this.hiredTrainers[i].isOnline=0;
                        this.trainers.push( this.hiredTrainers[i]);
                      }
            
                }else{
                  this.trainers.push(this.hiredTrainers[i]);
                }
            }
          }
      
        this.assignCopy();
        this.trainersdata[0].counter=0;
      }
  }

 checkvalue(vale:any,matchvalue:Array<any>){
      for(var i in matchvalue[0]){
        if(matchvalue[0][i].indexOf(vale)>-1){
          return true;
        }
      }
  }

}
