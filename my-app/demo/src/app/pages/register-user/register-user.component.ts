import { 
	Component, 
	OnInit
} 							from '@angular/core';

import { 
	FormBuilder, 
	FormGroup,
	Validators
} 							from '@angular/forms';

import { 
	Router 
} 							from '@angular/router';

import * as _ 								from 'underscore';

import { ApiService }		from '../../core/api.service';
import { UtilService }		from '../../core/util.service';
import { DataService }		from '../../core/data.service';

import { Country }			from '../../models/country';
import { UserRegisterForm }	from '../../models/user-register-form';


/**
 * Funtion used for comparing password
 * @param g 
 */
function passwordMatchValidator(g: FormGroup) {
   return g.get('password').value === g.get('confirm_password').value
      ? null : {'mismatch': true};
}


@Component({
  	selector: 'app-register-user',
 	templateUrl: './register-user.component.html',
  	styleUrls: ['./register-user.component.css']
})


export class RegisterUserComponent implements OnInit {

	constructor(
		private fb  		: FormBuilder,
		private dataService : DataService,
		private api			: ApiService,
		private router      : Router,
		public 	util 		: UtilService,
	){}
	
	/**
	 *  BOOTSTRAP TAB VARIABLES & FUNCTIONS
	 */

		minTab = 1;      //Minimum Tab Step
		maxTab = 4       //Maximum Tab Step

		activeTab= this.minTab;
		disabledTabs:any=[2,3,4];

		/**
		 * Function used for make tab active used in template
		 * @param tabId 
		 */

		showTab(tabId:number){
			if(!this.isTabDisabled(tabId))
			  this.activeTab = tabId;
		}

		/**
		 * Check if tabid is active?
		 * @param tabId 
		 */
		isTabActive(tabId:number):boolean{
			return this.activeTab === tabId;
		}

		/**
		 * Check if tabid is disabled?
		 * @param tabId 
		 */

		isTabDisabled(tabId:number):boolean{
			return this.disabledTabs.indexOf(tabId) >= 0;
		}

		/**
		 * Change tab state from disabled to enabled and
		 * make it active
		 * @param tabId 
		 */
		makeActive(tabId:number){
			let i = this.disabledTabs.indexOf(tabId);
			if(i >= 0){
				this.disabledTabs.splice(i,1);
			}
			this.activeTab = tabId;
		}

		/**
		 * active next tab
		 */
		goNext(){
			let nextTab = this.activeTab + 1;
			if(nextTab <= this.maxTab){
				this.makeActive(nextTab);
			}	
		}
		/**
		 * active previous tab
		 */
		goPrevious(){
			let prevTab = this.activeTab - 1;
			if(prevTab >= this.minTab){
				this.makeActive(prevTab);
			}
		}


	/**
	 *  USER REGISRATION FORMS
	 */

		/**
		 * Declare model and registration forms variables.
		 */
		model = new  UserRegisterForm();          
		regForm1 : FormGroup;
		regForm2 : FormGroup;
		regForm3 : FormGroup;
		regForm4 : FormGroup;

		/**
		 * Initilize all registrations forms 
		 * and added validtions for form input.
		 */
		createRegForms(){
			// CREATE RegForm1 
			this.regForm1 = this.fb.group({	 
				first_name 	: ['', Validators.required],
				last_name  	: ['', Validators.required],
				nickname 	: ['', Validators.required],
				birth_date 	: ['', Validators.required],
				phone_number: ['', [ 
					Validators.minLength(10),
					Validators.maxLength(10),
					Validators.pattern("[0-9]*")
				]],
				email 		: ['', [ Validators.required,Validators.email ]],
				password 	: ['', [
					Validators.required,
					Validators.minLength(6),
					Validators.maxLength(20),
				]],
				confirm_password : ['', Validators.required],
				step:1
			},{ 
				validator : passwordMatchValidator
			});

			// CREATE RegForm2 
			this.regForm2 = this.fb.group({	 
				street 	: ['', Validators.required],
				street1 : [''],
				city  	: ['', Validators.required],
				state 	: ['', Validators.required],
				country : ['', Validators.required],
				zip : ['', [
					Validators.required,
					Validators.minLength(5),
					Validators.maxLength(6),
					Validators.pattern("[0-9]*"),
				]],
				timezone : ['', Validators.required],
				clock_display : ['24', Validators.required],
				preferred_language : ['', Validators.required],
				second_language : [''],
				step:2
			});

			// CREATE RegForm2 
			this.regForm3 = this.fb.group({	 
				height 	: ['', [
					Validators.required,
					Validators.pattern("[0-9]*")
				]],
				weight 	: ['', [
					Validators.required,
					Validators.pattern("[0-9]*")
				]],
				unit  	: ['', Validators.required],
				sleep_senstivity 	: ['', Validators.required],
				stride_length : ['',[
					Validators.required,
					Validators.pattern("[0-9]*")
				]],
				heart_rate_zones : ['', Validators.required],
				step:3
			});

			// CREATE RegForm3 
			this.regForm4 = this.fb.group({	 
				start_week:[''],
				description:[''],
				accept:['', [
					Validators.required,
					Validators.pattern('true')
				]],
				step:4
			});

		}	

		/**
		 * function used in template to go previous tab
		 */
		onBack(){
			if(this.activeTab > 1) this.activeTab--;
		}
		/**
		 * function used for go to next step
		 * check if submitted form is valid
		 * @param form 
		 */
		onNext(form:FormGroup){
			if(form.valid){
				const formModal = form.value;
				if(formModal.step < 4){
					this.goNext();
				}else{ 
					this.saveUser();	
				}	
			}
		}

		/**
		 *  function used for save data to server
		 */
		saveUser(){
			let self = this;
			this.prepareSave();
			this.api.register(this.model)
			.then(function(res){
				if(res.code === 200){  // if server response is success go to finish page.
					self.router.navigate(['register/finish']);
				}
			});
		}

		/**
		 * function used for get all data from all registerations forms
		 * and format all values before save.
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
			
			this.model.street = formModal.street +','+formModal.street1;
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

			this.model.start_week = formModal.start_week;
			this.model.description = formModal.description;
		}


		countries:any;
		states:any;
		cities:any;
		timezones:any;
		languages:any;

		/**
		 * fetch states from json for selected country 
		 * @param event 
		 */

		refreshStates(event:any){
			let countryId = event.target.value;
			this.getStates(countryId);
		}
		
		/**
		 * deprecated functions for fetch cities for selected state 
		 */
		refreshCities(event:any){
			this.getCities(event.target.value);
		}

		/**
		 * Get coutnries from data service
		 */
		getCountries(): void {
			this.dataService.getCountries() 
			  .subscribe(x => this.countries = x);
		}
		
		/**
		 * Depracated function for get cities
		 * @param cId 
		 */
		getCities(sId?:number): void {
			this.dataService.getCities() 
			  .subscribe(x => {
				for(let i in x){
					if(sId && x[i].state_id == sId){
							x[i].text = x[i].name; 
							delete x[i].state_id;
							delete x[i].name;
					}else{
						x.splice(i,1);
					}
				}
				this.cities = x;
			});
		}
	
		/**
		 * Get states from data service
		 */
		getStates(cId?:number): void {
			this.dataService.getStates() 
			  .subscribe(x => {
				this.states = (cId) ? _.where(x,{ country_id : cId}) : x;
			});
		}
		
		/**
		 * Get languages
		 */
		getLanguages(): void {
			this.dataService.getLanguages() 
			  .subscribe(x => {
				this.languages = x;
			});
		}
		
		/**
		 * Get timezoens
		 */
		getTimezones(): void {
			this.dataService.getTimezones() 
			  .subscribe(x => {
				let arr = [];  
				for(let i in x){
					arr.push(x[i]);
				}
				this.timezones = arr;
			});
		}
	
	/**
	 * Init function for component
	 */	
	ngOnInit() {
		this.createRegForms();
		this.getCountries();
		if(this.regForm2.get('country').value != ''){
			this.getStates(this.regForm2.get('country').value);
		}
		this.getTimezones();
		this.getLanguages();
	}
	//END OF COMPONENT
}