import { 
  Component, 
  OnInit, 
  Input,
  Output,
  EventEmitter,
  TemplateRef ,
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

import {
  UtilService
}               from '../../core/util.service';

import {
  ApiService
}               from '../../core/api.service';

import { LoaderService }  from '../../core/loader.service';

import { setTimeout } from 'timers';

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { AuthService }		from '../../core/auth.service';

import { BsModalService } 	from 'ngx-bootstrap/modal';
import { BsModalRef } 		from 'ngx-bootstrap/modal/bs-modal-ref.service';



@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})

export class UserFormComponent implements OnInit {
  
  @Input() model:any;
  @Output() save:EventEmitter<any> = new EventEmitter<any>(); 



  @ViewChild('addFilelicence') addFilelicence : any;
  rModel : any;
  userForm : FormGroup;
  allCountries:any;
  allStates:any;
  allLanguages:any;
  allTimezones:any;
  states:any;
  imageChangedEvent: any = '';
  showimage:boolean=false;
  showimage22:boolean=false;
	croppedImage: any = '';
  isImageCropped:boolean=false;
  @ViewChild('addimage') addimage: ElementRef;
  @ViewChild('addimage22') addimage22: ElementRef;
  modalRef: BsModalRef;
  colorTheme = 'theme-dark-blue';
  bsConfig: Partial<BsDatepickerConfig>;
  bsBirthDateConfig:Partial<BsDatepickerConfig>;
  rt:any='none';
  showImageLoader=false;

  constructor(
    private fb : FormBuilder, 
    private data : DataService, 

    private loader : LoaderService,
		private auth : AuthService,
    private util : UtilService,
    private api : ApiService,
    private modalService: BsModalService
  ) { }

  createForm(){
    this.userForm =  this.fb.group({
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
      height:['', Validators.required],
      weight:['', Validators.required],
      unit:['', Validators.required],
      sleep_senstivity:[''],
      stride_length:[''],
      heart_rate_zones:[''],
      skype_address:[''],
      age:['', Validators.required],
      treatment:['', Validators.required],
      activity_onjob:['', Validators.required],
      activity_ontime:[''],
      motivating:[''],
      no_go:[''],
      neck:[''],
      shoulder:[''],
      days:['', Validators.required],
      experience:['', Validators.required],
      biceps:[''],
      chest:[''],
      waist:[''],
      hips:[''],
      thigh:[''],
      calf:[''],
      phyical:[''],
     // start_week:'',
      description:['', Validators.required],
      photo:'',
      bodyphoto:''
    });
  }

  setForm(){
    let _model = this.beforeSetForm();
    this.userForm.setValue(_model); 
  }
  
  isFieldValid(field: string) {
    return !this.userForm.get(field).valid && this.userForm.get(field).dirty && this.userForm.get(field).touched;
  }

  
  beforeSetForm(){

    let rObj = {};

    let _street = this.model['street'].split(',');
    rObj['first_name'] = this.model['first_name'];
    rObj['last_name'] = this.model['last_name'];
    rObj['nickname'] = (this.model['nick_name'])?this.model['nick_name']:'';
    rObj['phone_number'] = this.model['phone_number'];
    rObj['email'] = this.model['email'];
    rObj['street'] = _street[0];
    rObj['street1'] = (_street[1]) ? _street[1] : '';
    rObj['country'] = (this.model['country'])?this.model['country']:'';
    rObj['state'] = (this.model['state'])?this.model['state']:'';
    rObj['city'] = (this.model['city'])?this.model['city']:'';
    rObj['zip'] = (this.model['zip'])?this.model['zip']:'';
    rObj['timezone'] = (this.model['timezone'])?this.model['timezone']:'0';
    rObj['clock_display'] = (this.model['clock_display'])?this.model['clock_display']:'24';
    rObj['preferred_language'] = (this.model['perferred_languages'])?this.model['perferred_languages']:'da';
    rObj['second_language'] = (this.model['second_language'])?this.model['second_language']:'en';
    rObj['photo'] = (this.model['photo'])? this.model['photo'] :'';
    rObj['bodyphoto'] = (this.model['bodyphoto'])? this.model['bodyphoto'] :'';
    if(this.model['birth_date']){
      var d = new Date(this.model['birth_date']);
      var ds =  ("0" + (d.getMonth() + 1)).slice(-2)+'/'+ ("0" + d.getDate()).slice(-2)+' '+d.getFullYear();
      console.log(ds);
      rObj['birth_date'] = ds;

    }else{
      rObj['birth_date']="";
    }
    rObj['height'] = (this.model['height'])? this.model['height'] :'';
    rObj['weight'] = (this.model['weight'])? this.model['weight'] :'';
    rObj['unit'] = (this.model['units'])? this.model['units'] :'';
    rObj['sleep_senstivity'] = (this.model['sleep_sensitivity'] && this.model['sleep_sensitivity'] !== 'undefined')? this.model['sleep_sensitivity'] :'';
    rObj['stride_length'] = (this.model['syride_length'])? this.model['syride_length'] :'';
    rObj['heart_rate_zones'] = (this.model['heart_rate'])? this.model['heart_rate'] :'';
    rObj['skype_address'] = (this.model['skype_address'])? this.model['skype_address'] :'';
    rObj['age'] = (this.model['age'])? this.model['age'] :'';
    rObj['treatment'] = (this.model['treatment'])? this.model['treatment'] :'';
    rObj['activity_onjob'] = (this.model['activity_onjob'])? this.model['activity_onjob'] :'';
    rObj['activity_ontime'] = (this.model['activity_ontime'])? this.model['activity_ontime'] :'';
    rObj['motivating'] = (this.model['motivating'])? this.model['motivating'] :'';
    rObj['no_go'] = (this.model['no_go'])? this.model['no_go'] :'';
    rObj['days'] = (this.model['days'])? this.model['days'] :'';
    rObj['experience'] = (this.model['experience'])? this.model['experience'] :'';
    rObj['neck'] = (this.model['neck'])? this.model['neck'] :'';
    rObj['shoulder'] = (this.model['shoulder'])? this.model['shoulder'] :'';
    rObj['biceps'] = (this.model['biceps'])? this.model['biceps'] :'';
    rObj['chest'] = (this.model['chest'])? this.model['chest'] :'';
    rObj['waist'] = (this.model['waist'])? this.model['waist'] :'';
    rObj['hips'] = (this.model['hips'])? this.model['hips'] :'';
    rObj['thigh'] = (this.model['thigh'])? this.model['thigh'] :'';
    rObj['calf'] = (this.model['calf'])? this.model['calf'] :'';
    rObj['phyical'] = (this.model['phyical'])? this.model['phyical'] :'';
    //rObj['start_week'] = (this.model['start_week'])? this.model['start_week'] :'';
    rObj['description'] = (this.model['description'])? this.model['description'] :'';
    return rObj;
  }

  deleteimage(){
   var self=this;
    if(confirm("Do you want to delete photo?")) {
      var data={id:this.model['email']};
      self.userForm.get('photo').setValue("");
        // this.api.deletephoto(data).then(function(res){
        // if(res.code==200){
        //   self.auth.updateProfile();
        //   self.setData();
        // }
      
        // })
     
    }

  }


  deletebodyimage(){
    var self=this;
     if(confirm("Do you want to delete body photo?")) {
       var data={id:this.model['email']};
       self.userForm.get('bodyphoto').setValue("");
         // this.api.deletephoto(data).then(function(res){
         // if(res.code==200){
         //   self.auth.updateProfile();
         //   self.setData();
         // }
       
         // })
      
     }
 
   }




  beforeSave(){
    let formModel  = this.userForm.value;
    this.model['first_name'] = formModel.first_name;
    this.model['last_name'] = formModel.last_name;
    this.model['nickname'] = formModel.nickname;
    this.model['birth_date'] = formModel.birth_date;
    this.model['phone_number'] = formModel.phone_number;
    this.model['email'] = formModel.email;

    this.model['city'] = formModel.city;
    this.model['country'] = formModel.country;
    if(formModel.street1 && formModel.street1!=='' && formModel.street1 !== 'undefined'){
      this.model['street'] = formModel.street +', '+formModel.street1;
    }else{
      this.model['street'] = formModel.street;
    }
    //this.model['street'] = formModel.street + ', ' +  formModel.street1;
    this.model['state'] = formModel.state;
    
    this.model['zip'] = formModel.zip;

    this.model['timezone'] = formModel.timezone;

    this.model['clock_display'] = formModel.clock_display;

    this.model['perferred_languages'] = formModel.preferred_language;
    
    this.model['additional_language'] = (formModel.second_language && formModel.second_language !== "undefined")?formModel.second_language:'';
    
    this.model['height'] =  formModel.height;

    this.model['weight'] =  formModel.weight;

    this.model['units'] =  formModel.unit;

    this.model['age'] = (formModel.age && formModel.age !== "undefined") ? formModel.age : '';
    this.model['treatment'] = (formModel.treatment && formModel.treatment !== "undefined") ? formModel.treatment : '';
    this.model['activity_onjob'] = (formModel.activity_onjob && formModel.activity_onjob !== "undefined") ? formModel.activity_onjob : '';
    this.model['activity_ontime'] = (formModel.activity_ontime && formModel.activity_ontime !== "undefined") ? formModel.activity_ontime : '';
    this.model['motivating'] = (formModel.motivating && formModel.motivating !== "undefined") ? formModel.motivating : '';
    this.model['no_go'] = (formModel.no_go && formModel.no_go !== "undefined") ? formModel.no_go : '';
    this.model['neck'] = (formModel.neck && formModel.neck !== "undefined") ? formModel.neck : '';
    this.model['shoulder'] = (formModel.shoulder && formModel.shoulder !== "undefined") ? formModel.shoulder : '';
    this.model['days'] = (formModel.days && formModel.days !== "undefined") ? formModel.days : '';
    this.model['experience'] = (formModel.experience && formModel.experience !== "undefined") ? formModel.experience : '';
    this.model['biceps'] = (formModel.biceps && formModel.biceps !== "undefined") ? formModel.biceps : '';
    this.model['chest'] = (formModel.chest && formModel.chest !== "undefined") ? formModel.chest : '';
    this.model['waist'] = (formModel.waist && formModel.waist !== "undefined") ? formModel.waist : '';
    this.model['hips'] = (formModel.hips && formModel.hips !== "undefined") ? formModel.hips : '';
    this.model['thigh'] = (formModel.thigh && formModel.thigh !== "undefined") ? formModel.thigh : '';
    this.model['calf'] = (formModel.calf && formModel.calf !== "undefined") ? formModel.calf : '';
    this.model['skype_address'] = (formModel.skype_address && formModel.skype_address !== "undefined") ? formModel.skype_address : '';
    if( this.model['treatment'] =="yes"){
      this.model['phyical'] = (formModel.phyical && formModel.phyical !== "undefined") ? formModel.phyical : '';
    }else{
      this.model['phyical'] ="";
    }
   
    this.model['syride_length'] =  formModel.stride_length;

    this.model['heart_rate'] =  formModel.heart_rate_zones;

    this.model['heart_rate_zones'] = formModel.heart_rate_zones;
    this.model['photo'] = formModel.photo;
    this.model['bodyphoto'] = formModel.bodyphoto;
    this.model['addtional_description'] = formModel.description;
    this.model['description'] = formModel.description;
    //console.log(this.model);
  }

  setData(){
    this.data.getLanguages().subscribe(x=>this.allLanguages=x);
    this.data.getTimezones().subscribe(x=>this.allTimezones=x);
    this.data.getCountries().subscribe(x=> this.allCountries=x);
    // this.data.getStates().subscribe(x=>{
    //   this.allStates=x;
    //   this.states = this.allStates.filter(x => x.country_id === this.model.country);
    // });
  }

  // refreshStates(event){
  //   this.states = this.allStates.filter(x => x.country_id === event.target.value);
  // }  
  
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
	}

	imageCropped(image: string) {
		this.croppedImage = image;
	}

  imagechange(){
  var self=this;
   this.showimage=true;
   this.rt='block';
   setTimeout(function(){
    let el: HTMLElement = self.addimage.nativeElement as HTMLElement;
    el.click();
   },2000)
  
  
  }

  imagechange22(){
    var self=this;
     this.showimage22=true;
     this.rt='block';
     setTimeout(function(){
      let el: HTMLElement = self.addimage22.nativeElement as HTMLElement;
      el.click();
     },2000)
    
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


  addlicence(event){
    let files=event.target.files;
    console.log((files[0].name).indexOf("jpg"));
  
    // if( files[0].name.indexOf("jpg")==-1 && files[0].name.indexOf("jpeg")==-1 && files[0].name.indexOf("png")==-1 && files[0].name.indexOf("pdf")==-1){
    //   alert("Please upload jpg,jpeg,png,pdf files only");
    //   return;
    // }
   // alert(343243);
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
    //self.userForm.get('licence').setValue('');
    var pattern = /image-*/;
    var reader = new FileReader();
    //self.showCertLoader = !self.showCertLoader;
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
          self.userForm.get('bodyphoto').setValue(res.imageurl);
         // self.showCertLoader = !self.showCertLoader;
          self.loader.hide();
        })
        .catch(function(){
          //self.showCertLoader = !self.showCertLoader;
        })
      };
      fileReader.readAsDataURL(self.addFilelicence.nativeElement.files[0]);      
    }
  }
	cropImage(){
		let self = this;
    self.showImageLoader = !self.showImageLoader;
    self.api.uploadImage({
      image : this.croppedImage
    }).then(function(res){
      self.userForm.get('photo').setValue(res.imageurl);
     // self.showImageLoader = !self.showImageLoader;
    })
    .catch(function(){
     // self.showImageLoader = !self.showImageLoader;
    })
		self.modalRef.hide();
	}

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }




  onSave(){
    if(this.userForm.valid){
      let self = this;
    
      if(this.showimage==true && this.showimage22==true){
        var croppedImage=  ((document.getElementById('image-div').getElementsByClassName("in")[0] as HTMLInputElement).src);
        var croppedImage22=  ((document.getElementById('driver').getElementsByClassName("in")[0] as HTMLInputElement).src);
       this.savedata(croppedImage,croppedImage22);
      }else if(this.showimage==true){
        var croppedImage=  ((document.getElementById('image-div').getElementsByClassName("in")[0] as HTMLInputElement).src);
        this.savedata22(croppedImage);
       }else if(this.showimage22==true){
        var croppedImage22=  ((document.getElementById('driver').getElementsByClassName("in")[0] as HTMLInputElement).src);
        this.savedata44(croppedImage22);
       }else{
        self.beforeSave();
        self.save.emit(self.rModel);
       }
    }
  }

  savedata44(croppedImage22){
    var self=this;
    self.api.uploadImage({
      image :croppedImage22
    }).then(function(res){
     
          self.userForm.get('bodyphoto').setValue(res.imageurl);
          self.beforeSave();
          self.save.emit(self.rModel);
       
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
      self.userForm.get('photo').setValue(res.imageurl);
          self.beforeSave();
          self.save.emit(self.rModel);
       
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
      self.userForm.get('photo').setValue(res.imageurl);
      if(croppedImage22){
        self.api.uploadImage({
          image :croppedImage22
        }).then(function(res){
          self.userForm.get('bodyphoto').setValue(res.imageurl);
          self.beforeSave();
          self.save.emit(self.rModel);
        })
      }else{
         self.beforeSave();
         self.save.emit(self.rModel);
      }
    })
    .catch(function(){
      self.showImageLoader = !self.showImageLoader;
    })
  }

  



  // onSave(){
  //   if(this.userForm.valid){
  //     let self = this;
  //    if(this.showimage==true){
  //     var croppedImage=  ((document.getElementsByClassName("in")[0] as HTMLInputElement).src);
  //     self.api.uploadImage({
  //       image :croppedImage
  //     }).then(function(res){
  //       self.userForm.get('photo').setValue(res.imageurl);
  //      // self.showImageLoader = !self.showImageLoader;
  //       self.beforeSave();
  //       self.save.emit(self.rModel);
  //     })
  //     .catch(function(){
  //       self.showImageLoader = !self.showImageLoader;
  //     })
  //    }else{
  //     self.beforeSave();
  //     self.save.emit(self.rModel);
  //    }
  //   }
  // }

  ngOnInit() {
    this.setData();
    this.createForm(); 
    this.setForm();
    this.bsConfig = Object.assign({}, { 
      containerClass: this.colorTheme,
      minDate:new Date(),
      maxDate:new Date(2018)  
    });
    this.bsBirthDateConfig = Object.assign({}, { 
      containerClass: this.colorTheme,
      minDate:new Date(1990),
      maxDate:new Date() 
    });
  }

}
