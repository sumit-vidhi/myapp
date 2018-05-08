import { Component, Inject, ViewChild, OnInit, ElementRef } from '@angular/core';
import { DOCUMENT} from '@angular/common';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
import { Router,ActivatedRoute }            from '@angular/router';

import { DataService }       from '../../core/data.service'; 
import { AuthService }       from '../../core/auth.service'; 
import { LoaderService } from '../../core/loader.service';
import { ApiService }       from '../../core/api.service';
import { MessageService }       from '../../core/message.service';

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
  selector: 'app-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.css']
})
export class HeaderSearchComponent implements OnInit {
 ratingOptions: Array<any> = [];
  locationOptions: Array<any> = [];
  specialityOptions: Array<any> = [];
  @ViewChild('myDiv') myDiv: ElementRef;

  allTrainers:Array<any>;
  trainers:Array<any>;
  loadnewTrainers:Array<any>;
  searchForm: FormGroup;
  search:string;
  trainersname:Array<any>;
  
  alertMessages:Array<AlertMessage>;

  constructor(
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
      {label : 'Strength Training', value:'strength_training'},
      {label : 'Weight Loss', value:'weight_loss'},
      {label : 'Endurance', value:'endurance'},
      {label : 'Diet And Nutritions', value:'diet_and_nutritions'},
      {label : 'Plyometrics', value:'plyometrics'},
      {label : 'Speed And Agility', value:'speed_and_agility'},
      {label : 'Functional Training', value:'functional_training'},
      {label : 'High Intensity Interval', value:'high_intensity_interval'},
      {label : 'Other', value:'other'}
    ]
  }

 

  
  
  createSearchForm(){
    this.searchForm = this.fb.group({
       location:'',
       speciality:'',
       rating:''
    });
  };
  
  autocomplete(keys:any){
    var self=this;
    keys=(this.searchForm.get('location').value==undefined || this.searchForm.get('location').value=="")?"all":this.searchForm.get('location').value;
   this.api.gettrainername(keys).then(function(result){
    self.trainersname=result.data;
    });
  
  }

  getname(name:any){
    this.searchForm.get('location').setValue(name);
    this.trainersname=[];
  }
  

  onSearch(){
    this.trainersname=[];
	  var city=this.searchForm.get('location').value;
	  var speciality=this.searchForm.get('speciality').value;
    var rating=this.searchForm.get('rating').value;
    if(this.auth.isLoggedIn){
      this.router.navigate(['/'],{ queryParams: { search: city,speciality: speciality,rating: rating}});
    }else{
      let el: HTMLElement = this.myDiv.nativeElement as HTMLElement;
      el.click();
     // alert("Please login to search trainers");
    }
     
  }

  

  public goToSearch(): void {
    let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#search');
    this.pageScrollService.start(pageScrollInstance);
  };  

  ngOnInit() {
    let self = this;
    self.alertMessages = [];
    this.createSearchForm();
   }
}
