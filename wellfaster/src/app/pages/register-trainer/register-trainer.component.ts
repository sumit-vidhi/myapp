import { 
	Component, 
  OnInit,
  ViewChild,
  ViewEncapsulation 
} 							              from '@angular/core';

import { 
	FormBuilder, 
  FormGroup,
  FormArray,
  Validators,
  AbstractControl
} 							              from '@angular/forms';

import { 
	Router 
}                             from '@angular/router';

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import * as _ 								from 'underscore';

import { ApiService }		  from '../../core/api.service';
import { UtilService }		from '../../core/util.service';
import { DataService }		from '../../core/data.service';
import { LoaderService }  from '../../core/loader.service';

import { Country }			from '../../models/country';
import { TrainerRegisterForm }	from '../../models/trainer-register-form';
import { FormControl } from '@angular/forms/src/model';


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

function minLengthArrValidator(g: FormGroup) {
  let arr = g.get('specialities').value;
  let farr=[];
  for(let a of arr){
    let r = false;
    for(let i in a)
      if(a[i] == true) farr.push(i);
  }
  return (farr.length > 0 ) ? null : {'minlengtharr': true};
}



@Component({
  selector: 'app-register-trainer',
  templateUrl: './register-trainer.component.html',
  styleUrls: ['./register-trainer.component.css'],
  encapsulation: ViewEncapsulation.None
  
})

export class RegisterTrainerComponent implements OnInit {

    minTab = 1;
    maxTab = 4 

    showCertLoader=false;

    activeTab= this.minTab;
    disabledTabs:any=[2,3,4];
    dismissible = true;
    @ViewChild('addFile') addFileInput : any;

    messages:any=[];

    model = new  TrainerRegisterForm()
    regForm1 : FormGroup;
    regForm2 : FormGroup;
    regForm3 : FormGroup;
    regForm4 : FormGroup;

    certArr:any=[];

    spArr:any=[
      {value:'general_fitness', name:'general fitness'},
      {value:'strenght_training', name:'strenght training'},
      {value:'weight_loss', name:'weight loss'},
      {value:'endurence', name:'endurence'},
      {value:'diet_and_nutritions', name:'diet and nutritions'},
      {value:'plyometrics', name:'plyometrics'},
      {value:'speed_and_agility', name:'speed and gility'},
      {value:'functional_training', name:'functional training'},
      {value:'high_intensity_interval', name:'high intensity interval'},
      {value:'other', name:'other'},
    ];

    countries:any;
    allStates:any;
    states:any;
    allCities:any;
    cities:any;
    timezones:any;
    languages:any;

    colorTheme = 'theme-dark-blue';
    
    bsConfig: Partial<BsDatepickerConfig>;

    //phone_mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    //calander_mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

    

    constructor(
      private fb  : FormBuilder,
      private api			: ApiService,
      public 	util : UtilService,
      private router      : Router,
      private loader : LoaderService,
      private dataService : DataService
    ){}

    showTab(tabId:number){
      if(!this.isTabDisabled(tabId))
        this.activeTab = tabId;
    }

    isTabActive(tabId:number):boolean{
      return this.activeTab === tabId;
    }

    isTabDisabled(tabId:number):boolean{
      return this.disabledTabs.indexOf(tabId) >= 0;
    }

    makeActive(tabId:number){
      let i = this.disabledTabs.indexOf(tabId);
      if(i >= 0){
        this.disabledTabs.splice(i,1);
      }
      this.activeTab = tabId;
    }

    goNext(){
      let nextTab = this.activeTab + 1;
      if(nextTab <= this.maxTab){
        this.makeActive(nextTab);
      }	
    }

    goPrevious(){
      let prevTab = this.activeTab - 1;
      if(prevTab >= this.minTab){
        this.makeActive(prevTab);
      }
    }



  /**
   *  USER REGISRATION FORMS
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
        clock_display : ['', Validators.required],
        preferred_language : ['', Validators.required],
        second_language : [''],
        step:2
      });

      // CREATE RegForm2 
      this.regForm3 = this.fb.group({	
        specialities : [ this.fb.array([
        ]), Validators.minLength(1)],
        certifications:this.fb.array([
        ]),
        educations:this.fb.array([
        ]),
        haveEducations:[''],
        haveCertifications:[''],
        short_description:[''],
        step:3
      },{ 
        validator : minLengthArrValidator
      });

      // CREATE RegForm3 
      this.regForm4 = this.fb.group({	 
        price_week:['', [
          Validators.required, 
          Validators.pattern("[0-9]*"), 
        ]],
        description:[''],
        accept:['', [
					Validators.required,
					Validators.pattern('true')
				]],
        step:4
      });

    }	

    isFieldValid(form:string, field:string){
      switch(form){
        case 'regForm1' : {
          return this.regForm1.get(field).invalid && ( 
            this.regForm1.get(field).dirty || 
            this.regForm1.get(field).touched);	
        }
        case 'regForm2' : {
          break;	
        }
        case 'regForm3' : {
          break;	
        }
        case 'regForm4' : {
          break;	
        }
      }
    }

    onBack(){
			if(this.activeTab > 1) this.activeTab--;
    }
    
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

    saveUser(){
			let self = this;
      this.prepareSave();
      self.loader.show();
      this.api.register(this.model)
			.then(function(res){
				if(res.code === 200){
          self.loader.hide();
					self.router.navigate(['register/finish']);
				}else{
          self.addError('Your Email already exist');
        }
			});
		}

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
      
      this.model.specialities = formModal.specialities.filter(arr => {
        for(let a in arr)
          return arr[a];
      }).map(arr => {
        for(let a in arr)
          return a;
      });

      this.model.educations = formModal.educations.map(arr => arr.text);;
      this.model.certifications = formModal.certifications.map(arr => arr.file);
      this.model.short_description = formModal.short_description;

      formModal = this.regForm4.value;
      
      this.model.price_week = formModal.price_week;
      this.model.description = formModal.description;

    }    

  /**
   *  FUCNTIONS FOR GET JSON
   */


    refreshStates(event:any){
      let countryId = event.target.value;
      this.states = this.allStates.filter(x => x.country_id == countryId)
    }

    refreshCities(event:any){
      let stateId = event.target.value;;
      this.cities = this.allStates.filter(x => x.country_id == stateId)
    }

    getCountries(): void {
      this.dataService.getCountries().subscribe(x => this.countries = x);
    }
    
    getCities(sId?:number): void {
      this.dataService.getCities().subscribe(x => this.allCities = x); 
    }

    getStates(cId?:number): void {
      this.dataService.getStates().subscribe(x => this.allStates = x);
    }

    getLanguages(): void {
      this.dataService.getLanguages().subscribe(x => this.languages = x);
    }

    getTimezones(): void {
      this.dataService.getTimezones().subscribe(x => this.timezones = x);
    }

    initSpecialities(){
      let arr = [];
      for(let i of this.spArr){
        let group = {};
        group[i.value]=false;
        arr.push(this.fb.group(group));
      }
      const spFormArray = this.fb.array(arr);
      this.regForm3.setControl('specialities', spFormArray);
    }

    addCertificate(event){
      // let self = this;
      // if (
      //   self.addFileInput.nativeElement.files && 
      //   self.addFileInput.nativeElement.files[0]
      // ) {
      //   const fileReader: FileReader = new FileReader();
      //   fileReader.onload = (event: Event) => {
      //     (self.regForm3.get('certifications') as FormArray).push(self.fb.group({
      //       file : fileReader.result
      //     }));
      //   };
      //   fileReader.readAsDataURL(self.addFileInput.nativeElement.files[0]);      
      // }

      let self = this;
      var pattern = /image-*/;
      var reader = new FileReader();
      self.showCertLoader = !self.showCertLoader;
     
      if (
        self.addFileInput.nativeElement.files && 
        self.addFileInput.nativeElement.files[0]
      ) {
        
        const fileReader: FileReader = new FileReader();
        fileReader.onload = (event: Event) => {
          self.api.uploadImage({
            image : fileReader.result 
          }).then(function(res){
            (self.regForm3.get('certifications') as FormArray).push(self.fb.group({
              file : res.imageurl
            }));
            self.showCertLoader = !self.showCertLoader;
          })
          .catch(function(){
            self.showCertLoader = !self.showCertLoader;
          })
        };
        fileReader.readAsDataURL(self.addFileInput.nativeElement.files[0]);      
      }
    }
  
    deleteCertificate(i:number){
      (this.regForm3.get('certifications') as FormArray).removeAt(i);
    }

    addEducation(){
      (this.regForm3.get('educations') as FormArray).push(this.fb.group({
        text:''
      }));
    }

    deleteEducation(i:number){
      (this.regForm3.get('educations') as FormArray).removeAt(i);
    }

    addError(msg:string){
      this.messages = [];
      this.messages.push({
        type:'danger',
        msg:msg
      });
    }


    ngOnInit() {
      this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
      this.createRegForms();
      this.initSpecialities();
      this.getCountries();
      this.getStates();
      this.getCities();
      this.getTimezones();
      this.getLanguages();
      
    }

}
