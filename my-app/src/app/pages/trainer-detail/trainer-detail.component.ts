import { Component, OnInit } from '@angular/core';

import { Inject, ViewChild,  ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, RouterModule,ActivatedRoute, Params } from '@angular/router';
import { LoaderService } from '../../core/loader.service';
import { ApiService }       from '../../core/api.service';
import { FormBuilder,FormGroup,Validators } 	from '@angular/forms';
import { MessageService } from '../../core/message.service';
import { AuthService } 	from '../../core/auth.service';
import {SafeResourceUrl, DomSanitizer} from '@angular/platform-browser'; 


declare function unescape(s:string): string;
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
class AlertMessage{
  type : string;
  msg : string;
  timeout:number;
  constructor(type:string, msg:string){
    this.type =type;
    this.msg=msg;
    this.timeout=5000;
  }
}

@Component({
  selector: 'app-trainer-detail',
  templateUrl: './trainer-detail.component.html',
  styleUrls: ['./trainer-detail.component.css']
})
export class TrainerDetailComponent implements OnInit {

  url: SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer, 
    private fb  : FormBuilder,
    private route: ActivatedRoute,
    private message:MessageService,
    private auth : AuthService,
    private api : ApiService,
    private loader:LoaderService,
    private router:Router,
		private pageScrollService: PageScrollService, 
		@Inject(DOCUMENT) private document: any) { 
      if(	window.localStorage.removeItem("detail")!=null){
        window.localStorage.removeItem("detail");
      }
  
    }

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
  education:any;
  education_name:any;
  education_year:any;
  trainerimage:any;
  alertMessages:Array<AlertMessage>;
  showDialognew = false;
  isModalShown: boolean = false;

  ngOnInit() {

    if(this.auth.user.role=='2' && (this.auth.user.approve=='comment' || this.auth.user.approve=='' ||  this.auth.user.approve==null)){
      this.router.navigate(['/account']);
    }
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
   changeimage(image){
     this.trainerimage=image;
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
    if(confirm("Great! Please confirm that you want to hire me")) {
      if(this.auth.isLoggedIn){
        this.loader.show();
        this.api.hireTrainer({
          trainer_id : this.trainerId,
          user_id : this.auth.user.id
        })
        .then(function(res){
          self.loader.hide();
          if(res.code === 200){
            if(res.message=="account_pending"){

              self.showDialognew=!self.showDialognew;
             // self.addMessage('danger','your request could not be sent. please update accpunt details');
            }
            else{
              
              self.addMessage('success','your request has been sucessfully sent');
              self.gotobottom();
              self.getdetails(self.trainerId);
            }
          }else{ 
            if(res.message=="user_not"){
            self.auth.logout();
         }else{
            self.addMessage('danger','your request could not be sent. please try again');
         }
          }
        })
        .catch(function(err){
          self.loader.hide();
        });
      }
    }
    
  }


  addMessage(type:string, msg:string){
    let _alert = new AlertMessage(type,msg);
    this.alertMessages = [_alert];
  }

  public gotobottom(): void {
		let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#details');
		this.pageScrollService.start(pageScrollInstance);
	  }; 
  
  editreview(id:any,review:any,rating:any){
  
  this.reviewForm.setValue({
    review: review, 
    rate: rating
  });
  this.reviewid=id;
  this.showDialog=!this.showDialog;
 
  }

  openpdf(url){
    let tab = window.open();
    this.api.downloadPDF(url).subscribe(data => {
      console.log(data);
        const fileUrl = URL.createObjectURL(data);
       
        tab.location.href = fileUrl;
      });
  }

  onVidModalShown(){
    this.isModalShown = true;
  }

  onVidModalHidden(){
    this.isModalShown = false;
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
        self.gotobottom();
        this.loader.hide();
        var re = /_/gi; 
        var str = res.data[0].specialities;
        delete res.data[0].specialities;
        res.data[0].description=unescape(res.data[0].description);
        res.data[0].addtional_description=unescape(res.data[0].addtional_description);
        var newstr = str.replace(re, " ").toUpperCase(); 
        res.data[0].specialities=newstr;
        self.trainerdetail=res.data[0];
        if(res.data[0].video){

          self.url = self.sanitizer.bypassSecurityTrustResourceUrl(res.data[0].video);
        }
        // if(res.data[0].certifications!=""){

        //   self.certification=res.data[0].certifications.split(",");
        // }
        if(res.data[0].education!=""){
          
             self.education=this.filter_array(res.data[0].education.split(","));
        }
        if(res.data[0].education_name!=""){
          
             self.education_name=res.data[0].education_name.split(",");
        }
        if(res.data[0].education_year!=""){
          
             self.education_year=res.data[0].education_year.split(",");
        }
        self.trainerReviewdetail=res.reviewdata;
        self.totalreview=res.totalreview;
      }else{

      }
    });
  }

   filter_array(test_array) {
    var index = -1,
        arr_length = test_array ? test_array.length : 0,
        resIndex = -1,
        result = [];

    while (++index < arr_length) {
        var value = test_array[index];

        if (value) {
            result[++resIndex] = value;
        }
    }

    return result;
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
