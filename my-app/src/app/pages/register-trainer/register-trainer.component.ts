import { 
	Component, 
  OnInit,
  ViewChild,
  TemplateRef,
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
import { 
	GoogleLoginProvider, 
	FacebookLoginProvider,
	AuthService as SocialAuthService
}						from "angular4-social-login";

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import * as _ 								from 'underscore';
import { Inject,  ElementRef } from '@angular/core';
import { DOCUMENT} from '@angular/common';
import { ApiService }		  from '../../core/api.service';
import { UtilService }		from '../../core/util.service';
import { DataService }		from '../../core/data.service';
import { LoaderService }  from '../../core/loader.service';
import { StorageService } from '../../core/storage.service';
import { AuthService } 	from '../../core/auth.service';

import { Country }			from '../../models/country';
import { TrainerRegisterForm }	from '../../models/trainer-register-form';
import { FormControl } from '@angular/forms/src/model';

import { BsModalService } 	from 'ngx-bootstrap/modal';
import { BsModalRef } 		from 'ngx-bootstrap/modal/bs-modal-ref.service';


import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';

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
    facebook:boolean=true;
    @ViewChild('addFile') addFileInput : any;
    @ViewChild('addFileeducation') addFileInputeducation : any;
    @ViewChild('addFilevideo') addFileInputvideo : any;
    @ViewChild('addFilelicence') addFilelicence : any;
    showImageLoader=false;
    messages:any=[];

    model = new  TrainerRegisterForm()
    regForm1 : FormGroup;
    regForm2 : FormGroup;
    regForm3 : FormGroup;
    regForm4 : FormGroup;

    certArr:any=[];

    spArr:any=[
      {value:'general_fitness', name:'general fitness'},
      {value:'strength_training', name:'strength training'},
      {value:'weight_loss', name:'weight loss'},
      {value:'endurance', name:'endurance'},
      {value:'diet_and_nutritions', name:'diet and nutritions'},
      {value:'plyometrics', name:'plyometrics'},
      {value:'speed_and_agility', name:'speed and agility'},
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
    facebook_id:any="";
    photo:any="";
    licence:any="";
    colorTheme = 'theme-dark-blue';
    imageChangedEvent: any = '';
    croppedImage: any = '';
    isImageCropped:boolean=false;
    modalRef: BsModalRef;
    bsConfig: Partial<BsDatepickerConfig>;



    

    constructor(
      private fb  : FormBuilder,
      private api			: ApiService,
      public 	util : UtilService,
      private router      : Router,
      private auth : AuthService,
      private loader : LoaderService,
      private socialAuth : SocialAuthService,
      private storage:StorageService,
      private dataService : DataService,
      private pageScrollService: PageScrollService, 
      private modalService: BsModalService,
      @Inject(DOCUMENT) private document: any
    ){}

    slimOptions = {
      ratio: '1:1',
      download: true,
      service: this.slimService.bind(this),
      didInit: this.slimInit.bind(this)
  };

  // called when slim has initialized
  slimInit(data:any, slim:any) {
      // slim instance reference
      console.log(slim);

      // current slim data object and slim reference
      console.log(data);
  };

  // called when upload button is pressed or automatically if push is enabled
  slimService(formdata:any, progress:any, success:any, failure:any, slim:any) {
      // form data to post to server
      // set serviceFormat to "file" to receive an array of files
      console.log(formdata);

      // call these methods to handle upload state
      console.log(progress, success, failure);

      // reference to Slim instance
      console.log(slim);
  };
    
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

    gotoprice(){
      let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#trainer');
      this.pageScrollService.start(pageScrollInstance);
    }

    /*
    function name : goNext
	Explain :this function use for active next tab"
    */
    goNext(){
     var self=this;
      setTimeout(function(){ self.gotoprice(); }, 500);
    
      let nextTab = this.activeTab + 1;
      if(nextTab <= this.maxTab){
      
        window.scroll(100,0);
        this.makeActive(nextTab);
      }	
    }

    /*
    function name : isTabDisabled
	Explain :this function use for active previous tab"
    */

    goPrevious(){
      var self=this;
      setTimeout(function(){ self.gotoprice(); }, 500);
      let prevTab = this.activeTab - 1;
      if(prevTab >= this.minTab){
       
        window.scroll(100,0);
        this.makeActive(prevTab);
      }
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
    Explain :this function use for scroll down the trainer form"
    */
    public goToSearch(): void {
      let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#trainer');
      this.pageScrollService.start(pageScrollInstance);
      }; 

  /**
   *  USER REGISRATION FORMS
   */


 /*
    function name : createRegForms
	Explain :this function use for create form"
    */

    createRegForms(){
      
      // CREATE RegForm1 
      this.regForm1 = this.fb.group({	 
        first_name 	: ['', Validators.required],
        last_name  	: [' ', Validators.required],
        nickname 	: [''],
        birth_date 	: ['', Validators.required],
        phone_number: ['', [ 
          Validators.minLength(8),
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
        photo:[''],
        licence:[''],
        video:this.fb.array([
        ]),
        step:1
      },{ 
        validator : passwordMatchValidator
      });

      // CREATE RegForm2 
      this.regForm2 = this.fb.group({	 
        street 	: ['', Validators.required],
        street1 : [''],
        city  	: ['', Validators.required],
        state 	: [''],
        country : ['', Validators.required],
        zip : ['', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(6),
          Validators.pattern("[0-9]*"),
        ]],
        timezone : ['0', Validators.required],
        clock_display : ['', Validators.required],
        preferred_language : ['da', Validators.required],
        second_language : ['en'],
        step:2
      });

      // CREATE RegForm2 
      this.regForm3 = this.fb.group({	
        specialities : [ this.fb.array([
        ]), Validators.minLength(1)],
        // certifications:this.fb.array([
        // ]),
        // educations:this.fb.array([
        // ]),
        // haveEducations:[''],
        // haveCertifications:[''],
        addresses: this.fb.array([
          this.initAddress(),
        ]),
        short_description:['',Validators.required],
        step:3
      },{ 
        validator : minLengthArrValidator
      });

      // CREATE RegForm3 
      this.regForm4 = this.fb.group({
        bank_name:['',Validators.required],
        registration_number:['', [
          Validators.required, 
          Validators.pattern("[0-9]*"), 
        ]],
        account_number:['', [
          Validators.required, 
          Validators.pattern("[0-9]*"), 
        ]],
        swift:[''],
        iban:[''],
        cvr_vat:[''],	 
        price_week:['', [
          Validators.required, 
          Validators.pattern("[0-9]*"), 
        ]],
        price_premiumweek:['', [
          Validators.required, 
          Validators.pattern("[0-9]*"), 
        ]],
        pricesubscription_week:['', [
          Validators.required, 
          Validators.pattern("[0-9]*"), 
        ]],
        pricesubscription_premiumweek:[''],
        description:[''],
        accept:['', [
					Validators.required,
					Validators.pattern('true')
        ]],
        step:4
      });

    }	
    initAddress() {
      return this.fb.group({
          year: ['', Validators.required],
          education_name: ['',Validators.required],
          education: ['']
  
      });
  
     
  }
  

  /*
    function name : addAddress
  	Explain :this function use for  add new education name year and diploma"
    */
  addAddress() {
      const control = <FormArray>this.regForm3.controls['addresses'];
      control.push(this.initAddress());
  }
  
  /*
    function name : removeAddress
  	Explain :this function use for  remove new education name year and diploma"
    */
  removeAddress(i: number) {
      const control = <FormArray>this.regForm3.controls['addresses'];
      control.removeAt(i);
  }

 

  fileChange(i,input) {  
    this.readFiles(i,input.target.files);  
  }  
  readFile(file, reader, callback) {  
    reader.onload = () => {  
        callback(reader.result);  
       // this.model.student_img = reader.result;  
        console.log(reader.result);  
    }  
    reader.readAsDataURL(file);  
  }  
  readFiles(i,files, index = 0) { 
    let self = this; 
    // Create the file reader  
    let reader = new FileReader();  
    // If there is a file  
    if (index in files) {  
        // Start reading this file  
        this.readFile(files[index], reader, (result) => {  
            // Create an img element and add the image file data to it  
            var img = document.createElement("img");  
            img.src = result;  
            self.loader.show();
              self.api.uploadImage({
                image : result 
              }).then(function(res){
             
                const controlArray = <FormArray> self.regForm3.get('addresses');
                controlArray.controls[i].get('education').setValue(res.imageurl);
                self.loader.hide();
              })
            
            // Send this img to the resize function (and wait for callback)  
             
        });  
    } else {  
        // When all files are done This forces a change detection  
       // this.changeDetectorRef.detectChanges();  
    }  
  } 


  fileChangeEvent(event: any): void {
   
    this.imageChangedEvent = event;
    var files = event.target.files;
    var file = files[0];
    this.getBase64(file);
  
    
  }


  onVidModalHidden(){
    (<HTMLInputElement>window.document.getElementById('photo'))
    .value = "";
  } 
   getBase64(file) {
     var self=this;
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result);
      self.croppedImage = reader.result;
      
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }
 
  

  

	imageCropped(image: string) {
		this.croppedImage = image;
  }
  

/*
    function name : deleteimage
  	Explain :this function use for  remove image"
    */
  deleteimage(){
    var self=this;
     if(confirm("Do you want to delete photo?")) {
       self.regForm1.get('photo').setValue("");
    }
 
  }


/*
    function name : deleteimage
  	Explain :this function use for  remove licenece"
    */ 
  deleteimagelicence(){
    var self=this;
     if(confirm("Do you want to delete photo?")) {
       self.regForm1.get('licence').setValue("");
    }
 
  }

  /*
    function name : deleteimage
  	Explain :this function use for  crop  image"
    */ 
	cropImage(){
    let self = this;
   // ((document.getElementById("num1") as HTMLInputElement).value);
  var croppedImage=  ((document.getElementsByClassName("in")[0] as HTMLInputElement).src);
    console.log(self.croppedImage);
   this.loader.show();
    self.api.uploadImage({
      image : croppedImage
    }).then(function(res){
      self.regForm1.get('photo').setValue(res.imageurl);
     // self.showImageLoader = !self.showImageLoader;
      self.loader.hide();
    })
    .catch(function(){
     // self.showImageLoader = !self.showImageLoader;
    })
  
		self.modalRef.hide();
  }


 /*
    function name : deleteimage
  	Explain :this function use for  add  licence"
    */ 
  addlicence(event){
    let files=event.target.files;
    console.log((files[0].name).indexOf("jpg"));
  

    let self = this;
    self.regForm1.get('licence').setValue('');
    var pattern = /image-*/;
    var reader = new FileReader();
    self.showCertLoader = !self.showCertLoader;
    this.loader.show();
    if (
      self.addFilelicence.nativeElement.files && 
      self.addFilelicence.nativeElement.files[0]
    ) {
      
      const fileReader: FileReader = new FileReader();
      fileReader.onload = (event: Event) => {
        self.api.uploadImage({
          image : fileReader.result 
        }).then(function(res){
          // (self.regForm3.get('certifications') as FormArray).push(self.fb.group({
          //   file : res.imageurl
          // }));
          self.regForm1.get('licence').setValue(res.imageurl);
          (<HTMLInputElement>window.document.getElementById('add-file22'))
          .value = "";
          self.showCertLoader = !self.showCertLoader;
          self.loader.hide();
        })
        .catch(function(){
          self.showCertLoader = !self.showCertLoader;
        })
      };
      fileReader.readAsDataURL(self.addFilelicence.nativeElement.files[0]);      
    }
  }
  
  /*
    function name : deleteimage
  	Explain :this function use for  crop  licence"
    */ 
  cropImagelicence(){
    let self = this;
    self.showImageLoader = !self.showImageLoader;
    self.api.uploadImage({
      image : self.croppedImage
    }).then(function(res){
      self.regForm1.get('licence').setValue(res.imageurl);
      self.showImageLoader = !self.showImageLoader;
    })
    .catch(function(){
      self.showImageLoader = !self.showImageLoader;
    })
		self.modalRef.hide();
	}

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  openModallicence(templatelicence: TemplateRef<any>) {
    this.modalRef = this.modalService.show(templatelicence);
  }


  /*
    function name : isFieldValid
	Explain :this function use for  form validation"
    */
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
      if(formModal.step ==1){
        let self = this;
        // ((document.getElementById("num1") as HTMLInputElement).value);
        var croppedImage=  ((document.getElementById('image-div').getElementsByClassName("in")[0] as HTMLInputElement).src);
        var croppedImage22=  ((document.getElementById('driver').getElementsByClassName("in")[0] as HTMLInputElement).src);
         console.log(self.croppedImage);
        this.loader.show();
         self.api.uploadImage({
           image : croppedImage
         }).then(function(res){
           self.regForm1.get('photo').setValue(res.imageurl);
           self.api.uploadImage({
            image : croppedImage22
          }).then(function(res){
            self.regForm1.get('licence').setValue(res.imageurl);
            self.loader.hide();
            self.goNext();
          })
          // self.showImageLoader = !self.showImageLoader;
          
         })
         .catch(function(){
          // self.showImageLoader = !self.showImageLoader;
         })
       
         self.modalRef.hide();
      }
			if(form.valid){
        const formModal = form.value;
				if(formModal.step < 4 && formModal.step > 1){
					this.goNext();
				}else{ 
					this.saveUser();	
				}	
			}
		}

    /*
    function name : saveUser
	Explain :this function use for save data to server"
    */
    saveUser(){
      this.prepareSave();
      if(this.facebook_id!=""){
        
      this.regForm1.controls['first_name'].enable();
      this.regForm1.controls['last_name'].enable();
      this.regForm1.controls['email'].enable();
      this.model.photo=this.photo;
      }
			let self = this;
     
      self.loader.show();
      this.model.facebook_id=this.facebook_id;
      
      console.log(this.model);
      this.api.register(this.model)
			.then(function(res){
				if(res.code === 200){
          if(res.message=="webuser"){
          self.loader.hide();
					self.router.navigate(['register/pending']);
          }else if(res.message=="facebookuser"){
            self.loader.hide();
            self.router.navigate(['register/pending']);
            // self.auth.setToken(res.token);	
            // self.auth.login();
          }



				}else{
          self.addError('Your Email already exist');
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
      this.model.photo = formModal.photo;
      this.model.licence = formModal.licence;
      this.model.video =formModal.video.map(arr => arr.file);
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
      
      this.model.specialities = formModal.specialities.filter(arr => {
        for(let a in arr)
          return arr[a];
      }).map(arr => {
        for(let a in arr)
          return a;
      });

      // this.model.educations = formModal.educations.map(arr => arr.file);
      // this.model.certifications = formModal.certifications.map(arr => arr.file);
      this.model.short_description = formModal.short_description;
      this.model.addresses = formModal.addresses;

      formModal = this.regForm4.value;
      this.model.bank_name = formModal.bank_name;
      this.model.registration_number = formModal.registration_number;
      this.model.account_number = formModal.account_number;
      this.model.swift = formModal.swift;
      this.model.iban = formModal.iban;
      this.model.cvr_vat = formModal.cvr_vat;
      this.model.price_week = formModal.price_week;
      this.model.price_premiumweek = formModal.price_premiumweek;
      this.model.pricesubscription_week = formModal.pricesubscription_week;
      this.model.pricesubscription_premiumweek = formModal.pricesubscription_premiumweek;
      this.model.description = formModal.description;

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


    /*
    function name : deleteimage
  	Explain :this function use for  add  certificate"
    */ 
    addCertificate(event){
      

      let self = this;
      var pattern = /image-*/;
      var reader = new FileReader();
     // self.showCertLoader = !self.showCertLoader;
     self.loader.show();
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
            self.loader.hide();
          //  self.showCertLoader = !self.showCertLoader;
          })
          .catch(function(){
           // self.showCertLoader = !self.showCertLoader;
          })
        };
        fileReader.readAsDataURL(self.addFileInput.nativeElement.files[0]);      
      }
    }
  
    /*
    function name : deleteimage
  	Explain :this function use for  delete  certificate"
    */ 
    deleteCertificate(i:number){
      (this.regForm3.get('certifications') as FormArray).removeAt(i);
    }

    /*
    function name : deleteimage
  	Explain :this function use for  add  education"
    */ 
    addEducation(i,event){
      //console.log(232323);
      let self = this;
      var pattern = /image-*/;
      var reader = new FileReader();
     // self.showCertLoader = !self.showCertLoader;
     self.loader.show();
      if (
        self.addFileInputeducation.nativeElement.files && 
        self.addFileInputeducation.nativeElement.files[0]
      ) {
        
        const fileReader: FileReader = new FileReader();
        fileReader.onload = (event: Event) => {
          self.api.uploadImage({
            image : fileReader.result 
          }).then(function(res){
            const controlArray = <FormArray> self.regForm3.get('addresses');
            controlArray.controls[i].get('education').setValue(res.imageurl);
            self.loader.hide();
           // self.showCertLoader = !self.showCertLoader;
          })
          .catch(function(){
            //self.showCertLoader = !self.showCertLoader;
          })
        };
        fileReader.readAsDataURL(self.addFileInputeducation.nativeElement.files[0]);      
      }
    }

    /*
    function name : deleteimage
  	Explain :this function use for  remove  education"
    */ 
    deleteEducation(i:number){
      (this.regForm3.get('educations') as FormArray).removeAt(i);
    }

   
/*
    function name : deleteimage
  	Explain :this function use for  add  video"
    */ 
    addvideo(fileInput){
      let files=fileInput.target.files;
      console.log(files[0]);
      
      let self = this;
      this.loader.show();
      self.showCertLoader = !self.showCertLoader;
      let formData:FormData = new FormData();
      for(var i = 0; i < files.length; i++) {
        formData.append("uploads[]", files[i], files[i].name);
    }
    console.log(formData);
          self.api.uploadVideo(formData).then(function(res){
            (self.regForm1.get('video') as FormArray).push(self.fb.group({
              file : res.imageurl
            }));
            self.loader.hide();
          })
         
          
    }

    /*
    function name : deleteimage
  	Explain :this function use for  remove  video"
    */ 
    deletevideo(i:number){
      (this.regForm1.get('video') as FormArray).removeAt(i);
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
	function name : ngOnInit
	Explain :this function use for render trainer form"
    */
    ngOnInit() {
      this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
      this.createRegForms();
      this.initSpecialities();
      this.getCountries();
      //this.getStates();
      this.getCities();
      this.getTimezones();
      this.getLanguages();
      this.goToSearch();
      this.regForm2.patchValue({
        timezone: "0"
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

}
