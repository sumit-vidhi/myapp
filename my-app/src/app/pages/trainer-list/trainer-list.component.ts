import { 
  Component,
  OnInit 
}                           from '@angular/core';

import { Observable }       from 'rxjs/Observable';

import { ApiService }       from '../../core/api.service'; 
import { ChatService }       from '../../core/chat.service'; 

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

  
  constructor(public api : ApiService,public chatservice:ChatService) { }
  
    hiredTrainers :any[];
    trainersdata :any[];
    trainers :Array<any>=[];
    activeTrainer : any;
    users:Array<any>=[];
    setting:any;
    counter:any;

    assignCopy(){
      this.trainersdata = Object.assign([], this.trainers);
    }
    search(event){
          let term = event.target.value;
          if(term.trim() !== ''){
            let patt = new RegExp('^'+term, 'i');
            this.trainersdata = Object.assign([], this.trainers).filter(
              item => item.name.toLowerCase().indexOf(term.toLowerCase()) > -1
          )
          }else{
            this.assignCopy();
          }  
    }
    
    setActiveTrainer(tId?:number){
          if(tId!=null){
            this.trainersdata[tId].counter=0;
            this.activeTrainer = this.hiredTrainers[tId];
          }else{
            this.activeTrainer = this.hiredTrainers[0];
            
          }      
    }

    getTrainers(){
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
                self.hiredTrainers = res.data;
                self.setting=res.message_setting;
                self.setActiveTrainer();
                self.onlinedata();
              })
          .catch(function(err){
          });
    }
    
    ngOnInit() {
      let self = this;
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
            }else{
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
              this.trainers.push(this.hiredTrainers[i]);
            }else{
                if(this.hiredTrainers[i].id!=""){
                      if(this.checkvalue(this.hiredTrainers[i].id,this.users)){
                          this.hiredTrainers[i].isOnline=1;
                          this.trainers.push(this.hiredTrainers[i]);
                    
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
