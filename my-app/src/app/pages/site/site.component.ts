import { Component, Inject, ViewChild, OnInit, ElementRef } from '@angular/core';
import { DOCUMENT} from '@angular/common';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
import { Router,ActivatedRoute }            from '@angular/router';
import { DataService }       from '../../core/data.service'; 
import { AuthService }       from '../../core/auth.service'; 
import { LoaderService } from '../../core/loader.service';
import { ApiService }       from '../../core/api.service';
import { MessageService }       from '../../core/message.service';
import {SafeResourceUrl, DomSanitizer} from '@angular/platform-browser'; 
import { 
	FormBuilder, 
	FormGroup,
	FormArray,
	Validators
} 	            from '@angular/forms';

declare function unescape(s:string): string;
export function sortByName(a, b) {
  var nameA = a.first_name.toUpperCase(); // ignore upper and lowercase
  var nameB = b.first_name.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  // names must be equal
  return 0;
}

export function sortByrating(a, b) {
  var firstrating=a.rating;
  var secondrating=b.rating;
  if (firstrating < secondrating) {
    return 1;
  }
  if (firstrating > secondrating) {
    return -1;
  }
  // names must be equal
  return 0;
}

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
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['../../../assets/ng2-select/ng2-select.css', './site.component.css']
})

export class SiteComponent implements OnInit {
  url: SafeResourceUrl;
  @ViewChild('container')
  private container: ElementRef;

  ratingOptions: Array<any> = [];
  locationOptions: Array<any> = [];
  specialityOptions: Array<any> = [];


  allTrainers:Array<any>;
  trainers:Array<any>;
  loadnewTrainers:Array<any>;
  searchForm: FormGroup;
  search:string;
  speciality:string;
  rating:any;
  isModalShown: boolean = false;
  trainersname:Array<any>;
  reviewid:any;
  showDialog = false;
  showDialognew = false;
  reviewForm : FormGroup;
 
  alertMessages:Array<AlertMessage>;

  constructor(sanitizer: DomSanitizer,
    public router : Router,
    private route : ActivatedRoute,
    public data :DataService,
    private api : ApiService,
    private fb : FormBuilder,
    public auth : AuthService,
    private msg : MessageService,
    private loader:LoaderService,
    private pageScrollService: PageScrollService, 
    @Inject(DOCUMENT) private document: any
  ) { 
    this.url = sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/Bn6jT-sG6C4?autoplay=1');

    /*
       rating array 
   */
    this.ratingOptions = [
      {label : '1 star', value:'1'},
      {label : '2 star', value:'2'},
      {label : '3 star', value:'3'},
      {label : '4 star', value:'4'},
      {label : '5 star', value:'5'}
    ];
    this.locationOptions = [
      {label : 'All Location', value:'*'},
      {label : 'USA', value:'us'},
      {label : 'India', value:'in'}
    ];

    /*
       specialityOptions array 
   */
    this.specialityOptions = [
      {label : 'General Fitness', value:'general_fitness'},
      {label : 'Strenght Training', value:'strenght_training'},
      {label : 'Weight Loss', value:'weight_loss'},
      {label : 'Endurence', value:'endurence'},
      {label : 'Diet And Nutritions', value:'diet_and_nutritions'},
      {label : 'Plyometrics', value:'plyometrics'},
      {label : 'Speed And Gility', value:'speed_and_agility'},
      {label : 'Functional Training', value:'functional_training'},
      {label : 'High Intensity Interval', value:'high_intensity_interval'},
      {label : 'Other', value:'other'}
    ]
  }

  max: number = 5;
  rate: number = 4;
  isReadonly: boolean = true;
  filter:any;
  loadmore:boolean;
  
  trainersnotexist:boolean;
  page:any;
  
  @ViewChild('myDiv') myDiv: ElementRef;
  @ViewChild('privacy') privacy: ElementRef;
  @ViewChild('term') term: ElementRef;
  @ViewChild('myDivrequset') myDivrequset: ElementRef;
  

  /*
	function name : setTrainers
	Explain:trainers array sort
   */

  setTrainers(t:number, o?:number){
    if(!o) o = 0;
    this.trainers = this.allTrainers.slice(o,t);
  }


  /*
	function name : setTrainers
	Explain:trainers array sort with key
  */
  sortBy(type:string){
    switch(type){
      case 'name':
        this.allTrainers.sort(sortByName);
        break;
      case 'rating':
        this.allTrainers.sort(sortByrating);
        break;
    }
    this.setTrainers(this.trainers.length);
  }

  filterRating(rating:number){

  }


  /*
  function name : loadMore
  Service : api
	Explain:this function use for load more rainers
  */
  loadMore(){
    let self = this;
    this.loader.show();
    this.page++;
    let formModal={location:"",page:"",rating:"",speciality:""};
    formModal.location = self.search;
    formModal.rating = self.rating;
    formModal.speciality = self.speciality;
    formModal.page=this.page;
    let page={page:1};
    this.api.getTrainers(formModal)
    .then((res)=>{
      if(res.code == 200){
        for(var i in res.data){
          res.data[i].description=unescape(res.data[i].description);
        }
        this.loadnewTrainers=res.data;
        this.loadnewTrainers.forEach(function(x){
           self.trainers.push(x);
        });
      if(self.trainers.length==res.totaldata){
        this.loadmore=false;
      }
      this.loader.hide();
      }
    })
    .catch(function(err){
      this.loader.hide();
    })  
  
  }

  
   /*
  function name : createSearchForm
	Explain:this function use for create search form
  */
  createSearchForm(){
    this.searchForm = this.fb.group({
       location:'',
       speciality:'',
       rating:''
    });
  };

 /*
  function name : autocomplete
  Service : api
  Explain:this function use for search trainer name
  @param keys 
  */
  autocomplete(keys:any){
    var self=this;
    keys=(this.searchForm.get('location').value==undefined || this.searchForm.get('location').value=="")?"all":this.searchForm.get('location').value;
   this.api.gettrainername(keys).then(function(result){
    self.trainersname=result.data;
    });
  
  }


  /*
  function name : hireTrainer
  Service : api,loader
  Explain:this function use for hire trainer and send mail to trainer
  @param trainer 
  */
  hireTrainer(trainer:any){
    let self = this;
    if(confirm("Great! Please confirm that you want to hire me")) {
      if(this.auth.isLoggedIn){
        this.loader.show();
        this.api.hireTrainer({
          trainer_id : trainer.id,
          user_id : this.auth.user.id
        })
        .then(function(res){
          self.loader.hide();
          if(res.code === 200){
            if(res.message=="account_pending"){
              self.showDialognew=!self.showDialognew;
            }
            else{
             
              self.addMessage('success','your request has been sucessfully sent');
              self.onSearch();
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

  /*
	function name : addMessage
  Explain :this function use for add confirmation message ex. "email and password is incorrect"
  @param type,msg
   */

  addMessage(type:string, msg:string){
    let _alert = new AlertMessage(type,msg);
    this.alertMessages = [_alert];
  }


  /*
	function name : sort
  Explain :this function use for sort with name and rating"
  @param event
   */
  sort(event){
    if(event.target.value === 'name'){
      let totalpage=this.trainers.length
      this.trainers = this.trainers.sort(sortByName).slice(0,totalpage);
    }
    if(event.target.value === 'rating'){
      let totalpage=this.trainers.length
      this.trainers = this.trainers.sort(sortByrating).slice(0,totalpage);
    }
  }
  

  /*
  function name : onSearch
  Service : api,loader
	Explain :this function use for search trainer with Specialities and rating"
   */
  onSearch(){
    this.loader.show();
    let self = this;
    this.loadmore=false;
    this.trainersnotexist=false;
    this.trainers=[];
    this.page=0;
    let formModal = self.searchForm.value;
    formModal.page=this.page;
    this.api.getTrainers(formModal)
    .then((res)=>{
      if(res.code == 200){
        self.trainersnotexist=false;
        this.loader.hide();
        self.loadmore=true;
        for(var i in res.data){
          res.data[i].description=unescape(res.data[i].description);
        }
        self.trainers=res.data;
        if(self.trainers.length==res.totaldata){
           self.loadmore=false;
        }
        self.goToSearch();
      }else{
        if(res.message=="user_not"){
          self.auth.logout();
       }else{
        self.trainersnotexist=true;
        self.loadmore=false;
        this.loader.hide();
        self.goToSearch();
       }
      }
    });
  }

  /*
  function name : searchtrainer
  Explain :this function use for search trainer with Specialities and rating when user is not on home page"
  @param trainername
   */
  searchtrainer(trainername){
    //alert(trainername.value);
    this.search=trainername.value;
    this.searchBy();  
  }

   /*
  function name : searchBy
  Service : api,loader
	Explain :this function use for search trainer with Specialities and rating"
   */
  searchBy(){
    this.loader.show();
    let self = this;
    this.loadmore=false;
    this.trainersnotexist=false;
    this.trainers=[];
    this.page=0;
    var re = / /gi;
    var specility=this.search.replace(re,"_");
    console.log(specility);
    let formModal = {
      location : this.search,
      speciality : this.speciality,
	  rating:this.rating
    }
    this.api.getTrainers(formModal)
    .then((res)=>{
      if(res.code == 200){
        self.trainersnotexist=false;
        this.loader.hide();
        self.loadmore=true;
        for(var i in res.data){
          res.data[i].description=unescape(res.data[i].description);
        }
        self.trainers=res.data;
        if(self.trainers.length==res.totaldata){
           self.loadmore=false;
        }
        self.goToSearch();
      }else{
        if(res.message=="user_not"){
          self.auth.logout();
       }else{
        self.trainersnotexist=true;
        self.loadmore=false;
        this.loader.hide();
        self.goToSearch();
      }
    }
    });
  }

  /*
  function name : onVidModalShown
	Explain :this function use for show video popup and play video"
   */
  onVidModalShown(){
    this.isModalShown = true;
  }


  /*
  function name : onVidModalHidden
	Explain :this function use for hide video popup and stop video"
   */
  onVidModalHidden(){
    this.isModalShown = false;
  }  

  /*
  function name : onVidModalHidden
	Explain :this function use for scroll down when user search trainer"
   */
  public goToSearch(): void {
    let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#search');
    this.pageScrollService.start(pageScrollInstance);
  }; 


  /*
  function name : sendmail
  Explain :this function use for show send mail popup to trainer"
  @param id
   */
  sendmail(id:any){
    
    
    this.reviewid=id;
    this.showDialog=!this.showDialog;
   
    }
  
  /*
  function name : onSubmit
  Service : api,loader
  Explain :this function use for send mail to the tainer"
  @param revwid
   */
  onSubmit(revwid:any){
		let self = this;
    self.loader.show();
    
    let formModal = self.reviewForm.value;
    let id=this.auth.user.id;
    formModal.trainer_id=revwid;
    formModal.user_id=id;
   
    
    self.api.sendMail(formModal)
		.then(function(res){
			self.loader.hide();
			if(res.code === 200){	
        self.reviewForm.setValue({
          review: '', 
          subject: ''
        });
			}	else{
        if(res.message=="user_not"){
          self.auth.logout();
       }
      }				
		})
		.catch(function(err){
			self.loader.hide();	
			})

    this.showDialog = !this.showDialog;
  }


  /*
  function name : onSubmit
	Explain :this function use for check page in url"
   */
  checkpage() {
    //alert(1111);
    var self=this;
    this.route.queryParams
    .subscribe(params => {
		var size = Object.keys(params).length;
        if(size>0){
          if(params['page']=="privacy"){
            setTimeout(() => {
              let el: HTMLElement = self.privacy.nativeElement as HTMLElement;
              el.click();
            }, 1000);
         
            }else if(params['page']=="terms"){
              setTimeout(() => {
                let el: HTMLElement = self.term.nativeElement as HTMLElement;
                el.click();
              }, 1000);
            }
        }

              
          });
  }

  /*
    function name : ngOnInit
    Service : auth
    Explain :this function use for check user login or not and redirect to according this and create send trainer mail form"
  */
  ngOnInit() {
    let self = this; 
   if(!this.auth.isLoggedIn){
      this.checkpage();
    
   }
    this.auth.handleAuth();
		if(this.auth.user.role=='2' && (this.auth.user.approve=='comment' || this.auth.user.approve=='' ||  this.auth.user.approve==null)){
      this.router.navigate(['/account']);
    }
    this.reviewForm = this.fb.group({	
      review : ['', [
      Validators.required,
      
    ]],
    subject : ['', [
      Validators.required,
      
    ]]
  });
  
    self.alertMessages = [];
    this.createSearchForm();
    if(this.auth.isLoggedIn){
      this.checkpage();
    this.route.queryParams
    .subscribe(params => {
		var size = Object.keys(params).length;
        if(size>0){
          if((params['search']=="" || params['search']!="") && !params['page']){
              self.search = (params['search'])?params['search']:"";
          self.speciality = (params['speciality'])?params['speciality']:"";
          self.rating = (params['rating'])?params['rating']:"";
              self.searchBy();
            }else{
              self.trainers=undefined;
            } 
        }else{
          self.trainers=undefined;
        }

              
          });
        }
  }

   /*
    function name : ngOnInit
    Explain :this function use for show login popup when user search trainer without login"
  */
  gologin(){
    let el: HTMLElement = this.myDiv.nativeElement as HTMLElement;
    el.click();
  }

}
