import { Component, OnInit } from '@angular/core';
import { Router, RouterModule,ActivatedRoute, Params } from '@angular/router';
import { LoaderService } from '../../core/loader.service';
import { ApiService }       from '../../core/api.service';
import {FormBuilder,FormGroup,Validators} 	from '@angular/forms';
import { MessageService } from '../../core/message.service';
import { AuthService } 	from '../../core/auth.service';

@Component({
  selector: 'app-trainer-detail',
  templateUrl: './trainer-detail.component.html',
  styleUrls: ['./trainer-detail.component.css']
})
export class TrainerDetailComponent implements OnInit {

  constructor( 
    private fb  : FormBuilder,
    private route: ActivatedRoute,
    private message:MessageService,
    private auth : AuthService,
    private api : ApiService,
    private loader:LoaderService,
    private router:Router) { }

  trainerId:any;
  max: number = 5;
  rate: number = 4;
  trainerdetail:Array<any>;
  trainerReviewdetail:Array<any>;
  totalreview:any;
  isReadonly: boolean = true;
  showDialog = false;
  reviewForm : FormGroup;
	dismissible = true;
  messages:any[];
  redirecturl:any;
  reviewid:any;
  certification:any;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.trainerId=params['id']; //log the value of id
    });
    this.router.events.subscribe((url:any) => url);
    this.redirecturl=this.router.url;  // to print only path eg:"/login"

    let id=this.trainerId;
  // console.log(id);
    this.getdetails(id);

    this.resetMessage();
		this.reviewForm = this.fb.group({	
  			review : ['', [
        Validators.required,
        
      ]],
      rate:[]
		});
		
		let _message = this.message.getMessage();
		if(_message) this.messages.push(_message);
   }

   setMessage(message:string){
		this.resetMessage();
		this.messages.push({
			type : 'danger',
			text: message
		});
  }

  hireTrainer(trainer:any){
    let self = this;
    if(confirm("Are you sure to subscribe")) {
      if(this.auth.isLoggedIn){
        this.loader.show();
        this.api.hireTrainer({
          trainer_id : this.trainerId,
          user_id : this.auth.user.id
        })
        .then(function(res){
          self.loader.hide();
          if(res.code === 200){
           // self.addMessage('success','your request has been sucessfully sent');
            self.getdetails(self.trainerId);
          }else{
           // self.addMessage('danger','your request could not be sent. please try again');
          }
        })
        .catch(function(err){
          self.loader.hide();
        });
      }
    }
    
  }
  
  editreview(id:any,review:any,rating:any){
  
  this.reviewForm.setValue({
    review: review, 
    rate: rating
  });
  this.reviewid=id;
  this.showDialog=!this.showDialog;
 
  }

	resetMessage(){
		this.messages = [];
	}

  getdetails(id:any){
    this.loader.show();
    var self=this;
    let data={"id":id};
    this.api.getTrainerdetail(data)
    .then((res)=>{
      if(res.code == 200){
        this.loader.hide();
        var re = /_/gi; 
        var str = res.data[0].specialities;
        delete res.data[0].specialities;
        var newstr = str.replace(re, " ").toUpperCase(); 
        res.data[0].specialities=newstr;
        self.trainerdetail=res.data[0];
        if(res.data[0].certifications!=null || res.data[0].certifications!=""){

          self.certification=res.data[0].certifications.split(",");
        }
        self.trainerReviewdetail=res.reviewdata;
        self.totalreview=res.totalreview;
      }else{

      }
    });
  }

  onSubmit(revwid:any){
		let self = this;
		self.loader.show();
    let formModal = self.reviewForm.value;
    let id=this.auth.user.id;
    let trianerId=this.trainerId;
    formModal.trainer_id=trianerId;
    formModal.user_id=id;
    if(revwid){
      formModal.reviewid=revwid;
    }else{
      formModal.reviewid="";
    }
    
    self.api.saveReview(formModal)
		.then(function(res){
			self.loader.hide();
			if(res.code === 200){	
        self.getdetails(self.trainerId);
			}					
		})
		.catch(function(err){
			self.loader.hide();	
			//self.loginForm.reset();
			self.setMessage('Received error response from server. Please try again');
		})

    this.showDialog = !this.showDialog;
  }
  
  deletereview(id:any){

  }



}
