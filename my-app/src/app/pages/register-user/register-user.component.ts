import { 
	Component, 
	OnInit
} 							from '@angular/core';

import { 
	FormBuilder, 
	FormGroup,
	Validators,
	AbstractControl
} 							from '@angular/forms';
import { 
	GoogleLoginProvider, 
	FacebookLoginProvider,
	AuthService as SocialAuthService
}						from "angular4-social-login";

import { 
	Router 
} 							from '@angular/router';

import { 
	BsDatepickerConfig 
} 							from 'ngx-bootstrap/datepicker';

import * as _ 				from 'underscore';

import { Inject, ViewChild,  ElementRef } from '@angular/core';
import { DOCUMENT} from '@angular/common';
import { ApiService }		from '../../core/api.service';
import { UtilService }		from '../../core/util.service';
import { DataService }		from '../../core/data.service';
import { LoaderService }  from '../../core/loader.service';

import { StorageService } from '../../core/storage.service';
import { AuthService } 	from '../../core/auth.service';
import { Country }			from '../../models/country';
import { UserRegisterForm }	from '../../models/user-register-form';

import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';

/**
 * Funtion used for comparing password
 * @param g 
 */
function passwordMatchValidator(g: FormGroup) {
   return g.get('password').value === g.get('confirm_password').value
      ? null : {'mismatch': true};
}

export class ValidateEmailNotTaken {
	static createValidator(api: ApiService) {
	  return (control: AbstractControl) => {
		return api.checkEmailToken({
		  email : control.value }).then(function(res){
		  return res.code===200 ? null : { emailTaken: true };
		});
	  };
	}
}

@Component({
  	selector: 'app-register-user',
 	templateUrl: './register-user.component.html',
  	styleUrls: ['./register-user.component.css']
})


export class RegisterUserComponent implements OnInit {

	minTab = 1;      //Minimum Tab Step
	maxTab = 4       //Maximum Tab Step

	activeTab= this.minTab;
	disabledTabs:any=[2,3,4];

	dismissible = true;
	messages:any=[];

	model = new  UserRegisterForm();          
	regForm1 : FormGroup;
	regForm2 : FormGroup;
	regForm3 : FormGroup;
	regForm4 : FormGroup;

	allCountries:any;
	allStates:any;
	allCities:any;
	timezones:any;
	languages:any;
	facebook:boolean=true;
	countries:any;
	states:any;
	cities:any;
	facebook_id:any="";
	photo:any="";
	colorTheme = 'theme-dark-blue';
	bsConfig: Partial<BsDatepickerConfig>;

	constructor(
		private fb  		: FormBuilder,
		private dataService : DataService,
		private api			: ApiService,
		private router      : Router,
		private auth : AuthService,
		private loader : LoaderService,
		private socialAuth : SocialAuthService,
        private storage:StorageService,
		public 	util 		: UtilService,
		private pageScrollService: PageScrollService, 
		@Inject(DOCUMENT) private document: any
	){
		
		
	}
	
	/*
	function name : showTab
	Explain :this function use for select active tab"
	@param tabId
   */
	showTab(tabId:number){
		if(!this.isTabDisabled(tabId))
			this.activeTab = tabId;
	}

    /*
	function name : signInWithFB
	Service : socialAuth,api,storage,auth
	Explain :Facebook login
   */
    signInWithFB(): void {
		let self = this;
		  this.socialAuth
		  .signIn(FacebookLoginProvider.PROVIDER_ID)
		  .then((user) => {
			self.loader.show();
			  self.api.connect(user)
			  .then((res) => {
				  if(res.code == 200){
			self.loader.hide();
			if(res.message=="newuser"){
			  console.log(user);
              if( user.email!=undefined){
				this.regForm1.controls['email'].disable();
			   var  email=user.email;
			  }
			  if( user.email==undefined){
				this.regForm1.controls['email'].enable();
				var  email="";
			  }

			  this.regForm1.patchValue({
				first_name: user.firstName, 
				last_name: user.lastName, 
				email: email
			  });
			  this.facebook_id=user.id;
			  this.photo=user.photoUrl;
			  this.regForm1.controls['first_name'].disable();
			  this.regForm1.controls['last_name'].disable();
			  this.facebook=false;
			}else if(res.message=="existuser"){
			  self.auth.setToken(res.token);	
			  self.auth.login();
			}
						  
				  }else{
					  console.log('internal server error');
				  }
			  })
		  });
	}
	
	/*
    function name : goToSearch
    Explain :this function use for scroll down the user form"
    */
	public goToSearch(): void {
		let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#user');
		this.pageScrollService.start(pageScrollInstance);
	  }; 

	
	/*
    function name : goToSearch
	Explain :this function use for Check if tabid is active?"
	@param tabId
    */
	
	isTabActive(tabId:number):boolean{
		return this.activeTab === tabId;
	}

	

	
    /*
    function name : isTabDisabled
	Explain :this function use for Check if tabid is disabled?"
	@param tabId
    */
	isTabDisabled(tabId:number):boolean{
		return this.disabledTabs.indexOf(tabId) >= 0;
	}

	

	 /*
    function name : makeActive
	Explain :this function use for Change tab state from disabled to enabled and make it active"
	@param tabId
    */
	makeActive(tabId:number){
		let i = this.disabledTabs.indexOf(tabId);
		if(i >= 0){
			this.disabledTabs.splice(i,1);
		}
		this.activeTab = tabId;
	}

	
	/*
    function name : goNext
	Explain :this function use for active next tab"
    */
	goNext(){
		let nextTab = this.activeTab + 1;
		if(nextTab <= this.maxTab){
			this.makeActive(nextTab);
		}	
	}
	
	/*
    function name : isTabDisabled
	Explain :this function use for active previous tab"
    */
	goPrevious(){
		let prevTab = this.activeTab - 1;
		if(prevTab >= this.minTab){
			this.makeActive(prevTab);
		}
	}


    /*
    function name : createRegForms
	Explain :this function use for create form"
    */
	createRegForms(){
		// CREATE RegForm1 
		this.regForm1 = this.fb.group({	 
			first_name 	: ['', Validators.required],
			last_name  	: ['', Validators.required],
			nickname 	: [''],
			birth_date 	: [''],
			phone_number: [''],
			email 		: ['', 
				[ Validators.required,Validators.email ],
				[ValidateEmailNotTaken.createValidator(this.api)]
			],
			password 	: ['', [
				Validators.required,
				Validators.minLength(6),
				Validators.maxLength(20),
			]],
			confirm_password : ['', Validators.required],
			accept:['', [
				Validators.required,
				Validators.pattern('true')
			]],
			step:1
		},{ 
			validator : passwordMatchValidator
		});

		// CREATE RegForm2 
		this.regForm2 = this.fb.group({	 
			street 	: [''],
			street1 : [''],
			city  	: [''],
			state 	: [''],
			country : [''],
			zip : [''],
			timezone : [''],
			clock_display : [''],
			preferred_language : [''],
			second_language : [''],
			step:2
		});

		// CREATE RegForm2 
		this.regForm3 = this.fb.group({	 
			height 	: [''],
			weight 	: [''],
			unit  	: [''],
			sleep_senstivity 	: [''],
			stride_length : [''],
			heart_rate_zones : [''],
			step:3
		});

		// CREATE RegForm3 
		this.regForm4 = this.fb.group({	 
			//start_week:[''],
			description:[''],
		
			step:4
		});

	}	
	
	/*
    function name : isFieldValid
	Explain :this function use for  form validation"
    */
	isFieldValid(form:string, field:string){
		switch(form){
			case 'regForm1' : {
				return this.regForm1.get(field).invalid && this.regForm1.get(field).touched;	
			}
			case 'regForm2' : {
				return this.regForm2.get(field).invalid && this.regForm2.get(field).touched;		
			}
			case 'regForm3' : {
				return this.regForm3.get(field).invalid && this.regForm3.get(field).touched;	
			}
			case 'regForm4' : {
				return this.regForm4.get(field).invalid && this.regForm4.get(field).touched;
			//	break;	
			}
		}
	}

	/*
    function name : isFieldValid
	Explain :this function use for go previous tab"
    */
	onBack(){
		if(this.activeTab > 1) this.activeTab--;
	}


	/*
    function name : onNext
	Explain :this function use for go to next step check if submitted form is valid"
	@param form 
    */
	
	onNext(form:FormGroup){

		const formModal = form.value;
		console.log(this.facebook_id);
		console.log(formModal);
		if(this.facebook_id!=""  && formModal.step == 2){
			const formModal = form.value;
				this.saveUser();
			
		}
		else if(form.valid){
			const formModal = form.value;
			if(formModal.step == 1){
			
				this.saveUser();	
			}	
		}
	}
	
	/*
    function name : saveUser
	Explain :this function use for save data to server"
    */
	
	saveUser(){
		if(this.facebook_id!=""){
			
		  this.regForm1.controls['first_name'].enable();
		  this.regForm1.controls['last_name'].enable();
		  this.regForm1.controls['email'].enable();
		  }
		let self = this;
		this.prepareSave();
		self.loader.show();
		this.model.facebook_id=this.facebook_id;
		this.model.photo=this.photo;
		this.api.register(this.model)
		.then(function(res){
			self.loader.hide();
			if(res.code === 200){  // if server response is success go to finish page.
				if(res.message=="webuser"){
					self.loader.hide();
					  self.router.navigate(['register/finish']);
					}else if(res.message=="facebookuser"){
					  self.loader.hide();
					  self.auth.setToken(res.token);	
					  self.auth.login();
					}
			}
		});
	}

	
	/*
    function name : prepareSave
	Explain :this function use for get all data from all registerations forms and format all values before save"
    */
	prepareSave(){
		
		//GET VALUES FORM FORM1	
		let formModal = this.regForm1.value;
		
		this.model.first_name = formModal.first_name;
		this.model.last_name = formModal.last_name;
		this.model.nickname = formModal.nickname;
		this.model.birth_date = formModal.birth_date;
		this.model.phone_number = formModal.phone_number;
		this.model.email = formModal.email;
		this.model.password = formModal.password;
		this.model.confirm_password = formModal.confirm_password;
		
		formModal = this.regForm2.value;
		if(formModal.street1 && formModal.street1!=='' && formModal.street1 !== 'undefined'){
			this.model.street = formModal.street +', '+formModal.street1;
		}else{
			this.model.street = formModal.street;
		}
		
		this.model.city = formModal.city;
		this.model.state = formModal.state;
		this.model.country = formModal.country;
		this.model.zip = formModal.zip;
		this.model.timezone = formModal.timezone;
		this.model.clock_display = formModal.clock_display;
		this.model.preferred_language = formModal.preferred_language;
		this.model.second_language = formModal.second_language;

		formModal = this.regForm3.value;

		this.model.height = formModal.height;
		this.model.weight = formModal.weight;
		this.model.unit = formModal.unit;
		this.model.heart_rate_zones = formModal.heart_rate_zones;
		this.model.sleep_senstivity = formModal.sleep_senstivity;
		this.model.stride_length = formModal.stride_length;

		formModal = this.regForm4.value;

	//	this.model.start_week = formModal.start_week;
		this.model.description = formModal.description;
	}
   
	/*
    function name : refreshStates
	Explain :this function use for when country select then state refresh"
    */
	refreshStates(event:any){
		let countryId = event.target.value;
		if(countryId !== ''){
			this.states = this.allStates.filter(x => x.country_id == countryId);
			this.cities = [];
		}	
	}
	
	/*
    function name : refreshCities
	Explain :this function use for when state select then city refresh"
    */
	refreshCities(event:any){
		let stateId = event.target.value;
		if(stateId !== ''){
			this.cities = this.allCities.filter(x => x.state_id === stateId)
		}	
	}
	
	/*
	function name : getCountries
	Service : dataService
	Explain :this function use for get countries json file"
    */
	getCountries(): void {
		this.dataService.getCountries().subscribe(x => this.countries = x);
	}
	
	/*
	function name : getCities
	Service : dataService
	Explain :this function use for get cities json file"
    */
	getCities(sId?:number): void {
		this.dataService.getCities().subscribe(x => this.allCities = x); 
	}

	/*
	function name : getStates
	Service : dataService
	Explain :this function use for get states json file"
    */

	getStates(cId?:number): void {
		this.dataService.getStates().subscribe(x => this.allStates = x);
	}


	/*
	function name : getLanguages
	Service : dataService
	Explain :this function use for get languages json file"
    */
	getLanguages(): void {
		this.dataService.getLanguages().subscribe(x => this.languages = x);
	}

	/*
	function name : getTimezones
	Service : dataService
	Explain :this function use for get timezones json file"
    */

	getTimezones(): void {
		this.dataService.getTimezones().subscribe(x => this.timezones = x);
	}
	 
	/*
	function name : addError
	Explain :this function use for show error message"
    */
	addError(msg:string){
		this.messages = [];
		this.messages.push({
		  type:'danger',
		  msg:msg
		});
	}
	

	/*
	function name : initDatepicker
	Explain :this function use for show birth calender"
    */
	initDatepicker(){
		this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
	}


	/*
	function name : ngOnInit
	Explain :this function use for render user form"
    */
	ngOnInit() {
		this.createRegForms();
		this.getCountries();
		this.getStates();
		this.getCities();
		this.getTimezones();
		this.getLanguages();
		this.initDatepicker();
		this.goToSearch();
		this.regForm2.patchValue({
			timezone: "GMT+00:00"
		  });
		if(this.storage.get("first_name")!=null){
			this.setfields();
			this.unsetfields();
		   }
	}
	
	/*
	function name : setfields
	Explain :this function use for set fields"
    */
	setfields(){
		this.regForm1.patchValue({
		  first_name: this.storage.get("first_name"), 
		  last_name: this.storage.get("last_name"), 
		  email: this.storage.get("email")
		});
		this.facebook_id=this.storage.get("facebook_id");
		this.photo=this.storage.get("photo");
		this.regForm1.controls['first_name'].disable();
		this.regForm1.controls['last_name'].disable();
		this.regForm1.controls['email'].disable();
		this.facebook=false;
	}
	
	/*
	function name : setfields
	Explain :this function use for unset fields"
    */
	unsetfields(){
		this.storage.clear("first_name");
		this.storage.clear("last_name");
		this.storage.clear("facebook_id");
		this.storage.clear("email");
		this.storage.clear("photo");
	  }
	//END OF COMPONENT
}
