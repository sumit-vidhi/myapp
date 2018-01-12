import { 
  Component, 
  Directive, 
  Input,
  AfterViewInit, 
  OnChanges, 
  OnInit,
  OnDestroy,
  ViewChild,
  EventEmitter,
  ElementRef  
}                           from '@angular/core';

import { 
	FormBuilder, 
	FormGroup,
	FormArray,
	Validators
} 	            from '@angular/forms';

import { Subject } from 'rxjs/Subject';

import { ApiService } from '../../core/api.service';
import { ChatService } from '../../core/chat.service';
import { AuthService } from '../../core/auth.service';
import { LoaderService } from '../../core/loader.service';
import { StorageService } from '../../core/storage.service';
import { setInterval, setTimeout } from 'timers';

class Message {
  user_id : string;
  trainer_id : string;
  message:string;
  constructor(uId, tId){
    this.user_id = uId;
    this.trainer_id=tId;
    this.message = '';
  }
}

export function sortByDate(a, b) {
  var pDate = new Date(a.created_at);
  var pTime = (pDate.getTime() / 1000).toFixed();

  var cDate = new Date(b.created_at);
  var cTime = (cDate.getTime() / 1000).toFixed();


    if (pTime < cTime) {
      return -1;
    }
    if (pTime > cTime) {
      return 1;
    }
    // names must be equal
    return 0;
  }

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})



export class MessageComponent implements AfterViewInit{
  
  @Input('activeTrainer') trainer : any;
  @Input('setting') messagesetting : any;
  user:any;
  connection;
  onChanges = new Subject<any>();
  chekboxvalue:any;
  messages:Array<any>;

  msgForm:FormGroup;

  constructor(
    private fb : FormBuilder,
    private api : ApiService,
    private auth : AuthService,
  	private storage : StorageService,
    private chatService:ChatService,
		private loader : LoaderService
  ) { this.user = auth.user
   
  }
  setTrainers(t:number, o?:number){}
  
  createForm(){
    this.msgForm =  this.fb.group({
      message : ['', Validators.required],
      attachments:this.fb.array([
      ])
    });
  }  

  sendMessage(){

    let self = this;
    if(this.msgForm.valid){
      let formModel = this.msgForm.value;
      
      let model = new Message(this.user.id,this.trainer.id);
      model.message = formModel.message;
      var messagedata={};
     
      messagedata= {"message": model.message,"user":this.trainer.token,"recipient_id":this.trainer.id,"sender_id":this.user.id,"messagefrom":this.trainer.name,"messageto":this.user.first_name+" "+this.user.last_name}

      self.messages.push(messagedata);
      self.moveToBottom();
      this.chatService.sendMessagesocket(messagedata);
    
      this.api.sendMessage(model)
      .then(function(res){
        self.msgForm.reset();
       // self.moveToBottom
      })
      .catch(function(err){

      })
    }
  }

  prepareMessages(){
    let messages = [];
    if(this.messages.length > 0){
      this.messages.forEach(function(msg, index, msgs){
        if(messages.length>0){
          // let prevMsg = messages[messages.length-1];

          // var pDate = new Date(prevMsg.created_at);
          // var pTime = (pDate.getTime() / 60000).toFixed();

          // var cDate = new Date(msg.created_at);
          // var cTime = (cDate.getTime() / 60000).toFixed();

          // if(prevMsg.sender_id === msg.sender_id && cTime === pTime){
          //   messages[messages.length-1].messages.push(msg.message);
          //   //console.log('inside if');
          // }else{
            msg.messages = msg.message.split();
            messages.push(msg);
          //   console.log('inside else');
          // }
        }else{
          msg.messages = msg.message.split();
          messages.push(msg)
          //console.log('outside else');
        }  
        
      });
    }
   // console.log(this.messagesetting);
    if(this.messagesetting==null){
        this.chekboxvalue=1;
    }else{
      this.chekboxvalue=this.messagesetting;
    }

    this.messages = messages;
    this.moveToBottom();
      
  }

  getMessage(){
    let self = this;
    let data = {
      user_id : self.user.id,
      trainer_id : self.trainer.id
    }
    this.loader.show();
    this.api.getMessages(data)
    .then(function(res){
        self.messages = res.data;
        self.prepareMessages();
      	self.loader.hide();
      
      
    })
    .catch(function(err){
      self.loader.hide();
    })
  
}

  ngOnInit(){
    let self = this;
   
    self.onChanges.subscribe(()=>{
     
      self.getMessage();
    });
    self.createForm();
  
    this.connection ==this.chatService.getMessages().subscribe(data=>{ if (data) { 
      var userId= data.sender_id
      console.log(this.trainer)
      console.log(data);
      if(this.trainer.id==data.sender_id){
       data.messagefrom=data.messageto;
        self.messages.push(data);
      }
        self.prepareMessages();
         
         };
        })
  }
  // ngOnDestroy() {
  //   this.connection.unsubscribe();
  // }

  ngOnChanges(){
    this.onChanges.next();
  }

  moveToBottom(){
   (<any>$(".content")).mCustomScrollbar('scrollTo',100000);
  }

  ngAfterViewInit() {
    (<any>$(".content")).mCustomScrollbar();
    setTimeout(() => {
      this.moveToBottom();
    }, 100)
    
  }
  savesetting(){
    let formModal ={"setting":this.chekboxvalue};
    var self=this;
    this.loader.show();
    this.api.savesetting(formModal)
		.then(function(res){
			self.loader.hide();
			if(res.code === 200){
        alert("Message seting saved successfully");
      }
							
		})
		.catch(function(err){
			self.loader.hide();	
		
		})
  }

  logCheckbox(value:any){
    console.log(this.chekboxvalue);
    if(this.chekboxvalue==2){
      this.chekboxvalue=1;
    }else{
      this.chekboxvalue=value.value;
    }

  }

}
