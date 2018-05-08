

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
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['../../../assets/ng2-select/ng2-select.css', './site.component.css']
})

export class PriceComponent implements OnInit {
  url: SafeResourceUrl;
  @ViewChild('container')
  private container: ElementRef;
  @ViewChild('myDiv') myDiv: ElementRef;
  ratingOptions: Array<any> = [];
  locationOptions: Array<any> = [];
  specialityOptions: Array<any> = [];
  isModalShown: boolean = false;

  allTrainers:Array<any>;
  trainers:Array<any>;
  loadnewTrainers:Array<any>;
  searchForm: FormGroup;
  search:string;
  speciality:string;
  rating:any;
  
  
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
    this.url = sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/-7H8_jrEdgs?autoplay=1');

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

  setTrainers(t:number, o?:number){
    if(!o) o = 0;
    this.trainers = this.allTrainers.slice(o,t);
  }

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

  onVidModalShown(){
    this.isModalShown = true;
  }

  onVidModalHidden(){
    this.isModalShown = false;
  }  

  gologin(){
    let el: HTMLElement = this.myDiv.nativeElement as HTMLElement;
    el.click();
  }

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
  
  createSearchForm(){
    this.searchForm = this.fb.group({
       location:'',
       speciality:'',
       rating:''
    });
  };

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
              self.addMessage('danger','your request could not be sent. please update accpunt details');
            }
            else{
              self.addMessage('success','your request has been sucessfully sent');
              self.onSearch();
            }
          }else{
            self.addMessage('danger','your request could not be sent. please try again');
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
        self.trainers=res.data;
        if(self.trainers.length==res.totaldata){
           self.loadmore=false;
        }
        self.goToSearch();
      }else{
        self.trainersnotexist=true;
        self.loadmore=false;
        this.loader.hide();
      }
    });
  }

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
        self.trainers=res.data;
        if(self.trainers.length==res.totaldata){
           self.loadmore=false;
        }
        self.goToSearch();
      }else{
        self.trainersnotexist=true;
        self.loadmore=false;
        this.loader.hide();
      }
    });
  }

  public goToSearch(): void {
    let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#search');
    this.pageScrollService.start(pageScrollInstance);
  };  

  ngOnInit() {
    var self=this;
    setTimeout(function(){ self.gotoprice(); }, 1000);
    if(this.auth.user && this.auth.user.approve=='comment'){
      this.router.navigate(['/account']);
    }
 
  }

  gotoprice(){
    let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#price');
    this.pageScrollService.start(pageScrollInstance);
  }
}

