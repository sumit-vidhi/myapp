import { 
  Component, 
  OnInit, 
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ViewChild ,
  ElementRef 
}               from '@angular/core';
import { 
	FormBuilder, 
	FormGroup,
	FormArray,
	Validators
} 	            from '@angular/forms';

import {
  DataService
}               from '../../core/data.service';

import { AuthService }       from '../../core/auth.service'; 
import {
  ApiService
}               from '../../core/api.service';

import {
  UtilService
}               from '../../core/util.service';

import { setTimeout } from 'timers';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalService } 	from 'ngx-bootstrap/modal';
import { BsModalRef } 		from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { first } from 'rxjs/operator/first';

import { LoaderService }  from '../../core/loader.service';


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
  selector: 'app-trainer-form',
  templateUrl: './trainer-form.component.html',
  styleUrls: ['./trainer-form.component.css']
})

export class TrainerFormComponent implements OnInit {
  
  @Input() model:any;
  @Output() save:EventEmitter<any> = new EventEmitter<any>(); 
  @ViewChild('addFile') addFileInput : any;
  @ViewChild('addFile22') addFileInput22 : any;
  @ViewChild('addFilevideo') addFilevideo : any;
  @ViewChild('addFilelicence') addFilelicence : any;
  @ViewChild('addimage') addimage: ElementRef;
  @ViewChild('adddriver') adddriver: ElementRef;
  rModel : any;
  trainerForm : FormGroup;
  allCountries:any;
  allStates:any;
  allLanguages:any;
  allTimezones:any;
  states:any;
  imageChangedEvent: any = '';
	croppedImage: any = '';
  isImageCropped:boolean=false;
  modalRef: BsModalRef;
  showimage:boolean=false;
  showlicence:boolean=false;
  colorTheme = 'theme-dark-blue';
  bsConfig: Partial<BsDatepickerConfig>;
  bsBirthDateConfig:Partial<BsDatepickerConfig>;
  socialurl:any;
  rt:any='none';
  showCertLoader=false;
  showImageLoader=false;

  spArr:any=[
		{value:'general_fitness', name:'general fitness'},
		{value:'strength_training', name:'strength training'},
		{value:'weight_loss', name:'weight loss'},
		{value:'endurence', name:'endurance'},
		{value:'diet_and_nutritions', name:'diet and nutritions'},
		{value:'plyometrics', name:'plyometrics'},
		{value:'speed_and_agility', name:'speed and agility'},
		{value:'functional_training', name:'functional training'},
		{value:'high_intensity_interval', name:'high intensity interval'},
		{value:'other', name:'other'},
	];

  constructor(
    private fb : FormBuilder, 
    private data : DataService, 
    private util : UtilService,
    private api  : ApiService,
    private loader : LoaderService,
    public auth : AuthService,
    private modalService: BsModalService
  ) { }


    /*
    function name : createForm
  	Explain :this function use for create form"
    */
  createForm(){
    this.trainerForm =  this.fb.group({
      first_name: ['', Validators.required],
      last_name:['', Validators.required],
      nickname:[''],
      birth_date:['', Validators.required],
      phone_number: ['', [ 
				Validators.minLength(8),
				Validators.maxLength(10),
				Validators.pattern("[0-9]*")
			]],
      email:['', Validators.required],

      licence:['', Validators.required],
      video:this.fb.array([
      ]),
      street:['', Validators.required],
      street1:'',
      city:['', Validators.required],
      state:[''],
      country:['', Validators.required],
      zip : ['', [
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(6),
				Validators.pattern("[0-9]*"),
			]],
      timezone:['', Validators.required],
      clock_display:['', Validators.required],
      preferred_language:['', Validators.required],
      second_language:'',
      specialities : [ this.fb.array([
      ]), Validators.minLength(1)],
      // educations:this.fb.array([
      // ]),
      // certifications:this.fb.array([
      // ]),
      short_description:['', Validators.required],
      price_week:['', Validators.required],
      price_premiumweek:['', Validators.required],
      pricesubscription_week:['', Validators.required],
      pricesubscription_premiumweek:[''],
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
      description:'',
      photo:'',
      
      addresses: this.fb.array([
        this.initAddress(),
    ]),
    },{ 
      validator : minLengthArrValidator
    });
  }

  /*
    function name : createForm
  	Explain :this function use for create eduaction name year and diploma field"
    */
  initAddress() {
    return this.fb.group({
        year: ['', Validators.required],
        education_name: ['',Validators.required],
        education: ['']

    });

   
}

fileChange(i,input) {  
  this.readFiles(i,input.target.files);  
}  
readFile(file, reader, callback) {  
  reader.onload = () => {  
      callback(reader.result);  
      this.model.student_img = reader.result;  
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
           
              // const controlArray = <FormArray> self.trainerForm.get('addresses');
              const controlArray = self.trainerForm.get('addresses') as FormArray;
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


/*
    function name : addAddress
  	Explain :this function use for  add new education name year and diploma"
    */
addAddress() {
    // const control = <FormArray>this.trainerForm.controls['addresses'];
    const control = this.trainerForm.get(`addresses`) as FormArray;
    control.push(this.initAddress());
}

 /*
    function name : removeAddress
  	Explain :this function use for  remove new education name year and diploma"
    */
removeAddress(i: number) {
    // const control = <FormArray>this.trainerForm.controls['addresses'];
    const control = this.trainerForm.get(`addresses`) as FormArray;
    control.removeAt(i);
}

  
/*
    function name : setForm
  	Explain :this function use for  set data in form field "
    */
  setForm(){
    let _model = this.beforeSetForm();
    this.trainerForm.setValue(_model); 
   // this.trainerForm.get('birth_date').setValue("04-10-2018");
   
  }

  /*
    function name : initilizeFormArray
  	Explain :this function use for  set arraydata in form field "
    */

  initilizeFormArray(){
    let arr = [];
    let obj={education:''};
    let obj2={education_name:''};
    let obj4={year:''};
    let nobj={file:''};
    let fobj={file:''};
    let educations = this.model.education;
    let education_name = this.model.education_name;
    let education_year = this.model.education_year;
    let certification = this.model.certifications;
    let video = this.model.video;
    if(education_name.trim() !== ''){

      var groupArr=[]
     var e= educations.split(',');
     var e_N= education_name.split(',');
     var e_Y= education_year.split(',');
     for(var i=0;i<e_N.length;i++){
      groupArr.push(this.fb.group({'year':[e_Y[i],Validators.required],'education_name':[e_N[i],Validators.required],'education':e[i]}));
     }
     console.log(groupArr,);
     
      this.trainerForm.setControl('addresses',this.fb.array(groupArr));
    }
    // arr=[];
    // if(education_name.trim() !== ''){
    //   education_name.split(',').forEach((a) => {
    //     arr.push(this.fb.group(obj2));
    //   });
    //   this.trainerForm.setControl('addresses', this.fb.array(arr));
    // }
    // arr=[];
    // if(education_year.trim() !== ''){
    //   education_year.split(',').forEach((a) => {
    //     arr.push(this.fb.group(obj4));
    //   });
    //   this.trainerForm.setControl('addresses', this.fb.array(arr));
    // }
    // arr = [];
    // if(certification.trim() !== ''){
    //   certification.split(',').forEach((a) => {
    //     arr.push(this.fb.group(fobj));
    //   });
    //   this.trainerForm.setControl('certifications', this.fb.array(arr));
    // }
    arr = [];
    if(video.trim() !== ''){
      video.split(',').forEach((a) => {
        arr.push(this.fb.group(nobj));
      });
      this.trainerForm.setControl('video', this.fb.array(arr));
    }

    arr = [];
    for(let i of this.spArr){
      let group = {};
      group[i.value]=false;
      arr.push(this.fb.group(group));
    }
    this.trainerForm.setControl('specialities', this.fb.array(arr));
  }

  isFieldValid(field: string) {
    return !this.trainerForm.get(field).valid && this.trainerForm.get(field).dirty && this.trainerForm.get(field).touched;
  }

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
    function name : beforeSetForm
  	Explain :this function use for  set data before save"
    */
  beforeSetForm(){

    this.initilizeFormArray(); 

    let rObj = {};
    let specialities = [];
    // let educations = [];
    // let certifications = [];
    let video = [];
    
    if(this.model['specialities'] && this.model['specialities'].trim() !== ''){
      for(let attr of this.spArr){
        let obj = {};
        obj[attr.value] = this.model['specialities'].indexOf(attr.value) >= 0; 
        specialities.push(obj);
      }
    }
    // if(this.model['education'] && this.model['education'].trim() !== ''){
    //   let eduArr = this.model['education'].split(',');
    //   for(let attr of eduArr){
    //     let obj = {
    //       file:attr
    //     };
    //     educations.push(obj);
    //   }
    // }

    if(this.model['video'] && this.model['video'].trim() !== ''){
      let eduArr = this.model['video'].split(',');
      for(let attr of eduArr){
        let obj = {
          file:attr
        };
        video.push(obj);
      }
    }

    // if(this.model['certifications'] && this.model['certifications'].trim() !== ''){
    //   let eduArr = this.model['certifications'].split(',');
    //   for(let attr of eduArr){
    //     let obj = {
    //       file:attr
    //     };
    //     certifications.push(obj);
    //   }
    // }

    let _street = this.model['street'].split(',');
    rObj['first_name'] = this.model['first_name'];
    rObj['last_name'] = this.model['last_name'];
    rObj['nickname'] = (this.model['nick_name'])? this.model['nick_name'] :'';
    rObj['phone_number'] = this.model['phone_number'];
    rObj['email'] = this.model['email'];
    if(this.model['birth_date']){
      var d = new Date(this.model['birth_date']);
      var ds =  ("0" + (d.getMonth() + 1)).slice(-2)+'/'+ ("0" + d.getDate()).slice(-2)+' '+d.getFullYear();
      console.log(ds);
      rObj['birth_date'] = ds;

    }else{
      rObj['birth_date']="";
    }

    rObj['photo'] = (this.model['photo'])? this.model['photo'] :'';
    rObj['licence'] = (this.model['licence'])? this.model['licence'] :'';
    rObj['street'] = _street[0];
    rObj['street1'] = (_street[1])?_street[1]:'';
    rObj['country'] = (this.model['country'])?this.model['country']:'';
    rObj['state'] = (this.model['state'])?this.model['state']:'';
    rObj['city'] = (this.model['city'])?this.model['city']:'';
    rObj['zip'] = (this.model['zip'])?this.model['zip']:'';
    rObj['timezone'] = (this.model['timezone'])?this.model['timezone']:'GMT+04:30';
    rObj['clock_display'] = (this.model['clock_display'])?this.model['timezone']:'24';
    rObj['preferred_language'] = (this.model['perferred_languages'] && this.model['perferred_languages']!== "undefined")?this.model['perferred_languages']:'en';
    rObj['second_language'] = (this.model['additional_language'])?this.model['additional_language']:'';
    rObj['video'] = video;
    rObj['specialities'] = specialities;
    // rObj['educations'] = educations,
    // rObj['certifications'] = certifications;
    rObj['short_description'] = this.model['description'];
    rObj['bank_name'] = this.model['bank_name'];
    rObj['registration_number'] = this.model['registration_number'];
    rObj['account_number'] = this.model['account_number'];
    rObj['swift'] = this.model['swift'];
    rObj['iban'] = this.model['iban'];
    rObj['cvr_vat'] = this.model['cvr_vat'];
    rObj['description'] = this.model['addtional_description'];
    rObj['price_week'] = this.model['weeklyprice'];
    rObj['price_premiumweek'] = this.model['price_premiumweek'];
    rObj['pricesubscription_week'] = this.model['pricesubscription_week'];
    rObj['addresses'] = [];
    rObj['pricesubscription_premiumweek'] = this.model['pricesubscription_premiumweek'];
    
    
    console.log(rObj);
    return rObj;
  }

/*
    function name : setData
  	Explain :this function use for set languages timezones countries"
    */
  setData(){
    this.data.getLanguages().subscribe(x=>this.allLanguages=x);
    this.data.getTimezones().subscribe(x=>this.allTimezones=x);
    this.data.getCountries().subscribe(x=> this.allCountries=x);
    // this.data.getStates().subscribe(x=>{
    //   this.allStates=x;
    //   this.states = this.allStates.filter(x => x.country_id === this.model.country);
    // });
  }



   /*
    function name : imagechange
  	Explain :this function use for file change"
    */
    imagechange(){
      var self=this;
      this.showimage=true;
      this.rt='block';
      setTimeout(function(){
        let el: HTMLElement = self.addimage.nativeElement as HTMLElement;
        el.click();
      },2000)
    
    }


    /*
    function name : licencechange
  	Explain :this function use for licence change"
    */
    licencechange(){
      var self=this;
       this.showlicence=true;
       this.rt='block';
       setTimeout(function(){
        let el: HTMLElement = self.adddriver.nativeElement as HTMLElement;
        el.click();
       },2000)
      
    }
    
  
    /*
    function name : addCertificate
  	Explain :this function use for licence change"
    */
  addCertificate(event){
    console.log(32423423);
    let self = this;
    console.log(self.addFileInput.nativeElement.files);
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
          (self.trainerForm.get('certifications') as FormArray).push(self.fb.group({
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


   /*
    function name : deleteCertificate
  	Explain :this function use for remove Certificate"
    */
  deleteCertificate(i:number){
    (this.trainerForm.get('certifications') as FormArray).removeAt(i);
  }

   /*
    function name : addEducation
  	Explain :this function use for add education"
    */
  addEducation(i,event){
    console.log(i,event);
    let self = this;
    var pattern = /image-*/;
    var reader = new FileReader();
 console.log(self);
    if (
      self.addFileInput22.nativeElement.files && 
      self.addFileInput22.nativeElement.files
    ) {
      this.loader.show();
      const fileReader: FileReader = new FileReader();
      fileReader.onload = (event: Event) => {
        self.api.uploadImage({
          image : fileReader.result 
        }).then(function(res){
       
          // const controlArray = <FormArray> self.trainerForm.get('addresses');
          const controlArray = self.trainerForm.get('addresses') as FormArray;
          controlArray.controls[i].get('education').setValue(res.imageurl);
          self.loader.hide();
        })
        .catch(function(){ })
      };
      fileReader.readAsDataURL(self.addFileInput22.nativeElement.files[0]);      
    }
  }


  /*
    function name : deleteEducation
  	Explain :this function use for remove education"
    */
  deleteEducation(i:number){
    // const controlArray = <FormArray> this.trainerForm.get('addresses');
    const controlArray = this.trainerForm.get('addresses') as FormArray;
    controlArray.controls[i].get('education').setValue("");
    //(this.trainerForm.get('educations') as FormArray).removeAt(i);
  }


  /*
    function name : addvideo
  	Explain :this function use for add video"
    */
  addvideo(fileInput){
    let files=fileInput.target.files;
    console.log(files[0]);
    console.log( files[0].name);
    let self = this;
    this.loader.show();
    self.showCertLoader = !self.showCertLoader;
    let formData:FormData = new FormData();
    for(var i = 0; i < files.length; i++) {
      formData.append("uploads[]", files[i], files[i].name);
  }
  console.log(formData);
        self.api.uploadVideo(formData).then(function(res){
          (self.trainerForm.get('video') as FormArray).push(self.fb.group({
            file : res.imageurl
          }));
          self.loader.hide();
        })
       
        
  }


  /*
    function name : deletevideo
  	Explain :this function use for remove video"
    */
  deletevideo(i:number){
    (this.trainerForm.get('video') as FormArray).removeAt(i);
  }


  // refreshStates(event){
  //   this.states = this.allStates.filter(x => x.country_id === event.target.value);
  // }
  
  /*
    function name : deletevideo
  	Explain :this function use for add remove specialities"
    */
  addremoveSp(event){
    let specialities = [];
    if(this.trainerForm.get('specialities').value !== ''){
      specialities = this.trainerForm.get('specialities').value.split(',');
    }
    if(event.target.checked){
      if(specialities.indexOf(event.target.value) < 0)
        specialities.push(event.target.value); 
    }else{
      if(specialities.indexOf(event.target.value) >= 0)
        specialities.splice(specialities.indexOf(event.target.value),1);
    }
    this.trainerForm.get('specialities').setValue(specialities.join(',')); 
  }


  /*
    function name : deletevideo
  	Explain :this function use for file change and convert base64"
    */
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    var files = event.target.files;
    var file = files[0];
    this.getBase64(file);
  }
  

  /*
    function name : deletevideo
  	Explain :this function use for covert file in base64"
    */
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

/*
    function name : deletevideo
  	Explain :this function use for crop image"
    */

	imageCropped(image: string) {
		this.croppedImage = image;
  }
  


  deleteimage(){
    var self=this;
     if(confirm("Do you want to delete photo?")) {
       var data={id:this.model['email']};
       self.trainerForm.get('photo').setValue("");
         // this.api.deletephoto(data).then(function(res){
         // if(res.code==200){
         //   self.auth.updateProfile();
         //   self.setData();
         // }
       
         // })
      
     }
 
   }


   deleteimagelicence(){
    var self=this;
     if(confirm("Do you want to delete photo?")) {
       self.trainerForm.get('licence').setValue("");
    }
 
  }



  addlicence(event){
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
          self.trainerForm.get('licence').setValue(res.imageurl);
          self.showCertLoader = !self.showCertLoader;
        })
        .catch(function(){
          self.showCertLoader = !self.showCertLoader;
        })
      };
      fileReader.readAsDataURL(self.addFilelicence.nativeElement.files[0]);      
    }
  }

   cropImagelicence(){
    let self = this;
    self.showImageLoader = !self.showImageLoader;
    self.api.uploadImage({
      image : self.croppedImage
    }).then(function(res){
      self.trainerForm.get('licence').setValue(res.imageurl);
      self.showImageLoader = !self.showImageLoader;
    })
    .catch(function(){
      self.showImageLoader = !self.showImageLoader;
    })
		self.modalRef.hide();
	}


	cropImage(){
    let self = this;
    self.showImageLoader = !self.showImageLoader;
    self.api.uploadImage({
      image : self.croppedImage
    }).then(function(res){
      self.trainerForm.get('photo').setValue(res.imageurl);
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


  
  beforeSave(){
    let formModel  = this.trainerForm.value;
    this.model['first_name'] = formModel.first_name;
    this.model['last_name'] = formModel.last_name;
    this.model['nickname'] = formModel.nickname;
    this.model['birth_date'] = formModel.birth_date;
    this.model['phone_number'] = formModel.phone_number;
    this.model['email'] = formModel.email;
    this.model['licence'] = formModel.licence;
    this.model['city'] = formModel.city;
    this.model['country'] = formModel.country;
    if(formModel.street1 && formModel.street1!=='' && formModel.street1 !== 'undefined'){
      this.model['street'] = formModel.street +', '+formModel.street1;
    }else{
      this.model['street'] = formModel.street;
    }
    
    this.model['state'] = formModel.state;
    this.model['zip'] = formModel.zip;
    this.model['timezone'] = formModel.timezone;
    this.model['perferred_languages'] = formModel.preferred_language;
    this.model['additional_language'] = (formModel.second_language && formModel.second_language !== "undefined")?formModel.second_language:'';
    

    this.model['specialities'] = formModel.specialities.filter(arr => {
      for(let a in arr)
        return arr[a];
    }).map(arr => {
      for(let a in arr)
        return a;
    });

    // this.model.education = formModel.educations.map(arr => arr.file);
    // this.model.certifications = formModel.certifications.map(arr => arr.file);
    this.model.video = formModel.video.map(arr => arr.file);
    this.model['description'] = formModel.short_description;
    this.model['addresses'] = formModel.addresses;

    this.model['weeklyprice'] = formModel.price_week;
    this.model['price_premiumweek'] = formModel.price_premiumweek;
    this.model['pricesubscription_week'] = formModel.pricesubscription_week;
    this.model['pricesubscription_premiumweek'] = formModel.pricesubscription_premiumweek;
    
    this.model['photo'] = formModel.photo;
    this.model['licence'] = formModel.licence;
    this.model['bank_name'] = formModel.bank_name;
    this.model['registration_number'] = formModel.registration_number;
    this.model['account_number'] = formModel.account_number;
    this.model['swift'] = formModel.swift;
    this.model['iban'] = formModel.iban;
    this.model['cvr_vat'] = formModel.cvr_vat;
    if(this.auth.user.approve=='comment'){
      this.model['update'] = 1;
    }
    this.model['addtional_description'] = formModel.description;

  }


  onSave(){
    console.log(this.model);
    if(this.trainerForm.valid){
      let self = this;
    
      if(this.showimage==true && this.showlicence==true){
        var croppedImage=  ((document.getElementById('image-div').getElementsByClassName("in")[0] as HTMLInputElement).src);
        var croppedImage22=  ((document.getElementById('driver').getElementsByClassName("in")[0] as HTMLInputElement).src);
       this.savedata(croppedImage,croppedImage22);
      }else if(this.showimage==true){
        var croppedImage=  ((document.getElementById('image-div').getElementsByClassName("in")[0] as HTMLInputElement).src);
        this.savedata22(croppedImage);
       }else if(this.showlicence==true){
        var croppedImage22=  ((document.getElementById('driver').getElementsByClassName("in")[0] as HTMLInputElement).src);
        this.savedata44(croppedImage22);
       }else{
        self.beforeSave();
        self.save.emit(self.model);
       }
    }
  }

  savedata44(croppedImage22){
    var self=this;
    self.api.uploadImage({
      image :croppedImage22
    }).then(function(res){
     
          self.trainerForm.get('licence').setValue(res.imageurl);
          self.beforeSave();
          self.save.emit(self.model);
       
    })
    .catch(function(){
      self.showImageLoader = !self.showImageLoader;
    })
  }

  savedata22(croppedImage){
    var self=this;
    self.api.uploadImage({
      image :croppedImage
    }).then(function(res){
      self.trainerForm.get('photo').setValue(res.imageurl);
          self.beforeSave();
          self.save.emit(self.model);
       
    })
    .catch(function(){
      self.showImageLoader = !self.showImageLoader;
    })
  }

  savedata(croppedImage,croppedImage22){
    var self=this;
    self.api.uploadImage({
      image :croppedImage
    }).then(function(res){
      self.trainerForm.get('photo').setValue(res.imageurl);
      if(croppedImage22){
        self.api.uploadImage({
          image :croppedImage22
        }).then(function(res){
          self.trainerForm.get('licence').setValue(res.imageurl);
          self.beforeSave();
          self.save.emit(self.model);
        })
      }else{
         self.beforeSave();
         self.save.emit(self.model);
      }
    })
    .catch(function(){
      self.showImageLoader = !self.showImageLoader;
    })
  }

  

  ngOnInit() {
    this.socialurl=window.location.host
    this.setData();
    this.createForm(); 
    this.setForm();
    this.bsBirthDateConfig = Object.assign({}, { 
      containerClass: this.colorTheme,
      minDate:new Date(1990),
      maxDate:new Date() 
    });
  }

}
