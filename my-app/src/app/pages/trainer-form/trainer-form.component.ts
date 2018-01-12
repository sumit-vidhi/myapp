import { 
  Component, 
  OnInit, 
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ViewChild  
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
  colorTheme = 'theme-dark-blue';
  bsConfig: Partial<BsDatepickerConfig>;
  bsBirthDateConfig:Partial<BsDatepickerConfig>;

  showCertLoader=false;
  showImageLoader=false;

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

  constructor(
    private fb : FormBuilder, 
    private data : DataService, 
    private util : UtilService,
    private api  : ApiService,
    private modalService: BsModalService
  ) { }

  createForm(){
    this.trainerForm =  this.fb.group({
      first_name: ['', Validators.required],
      last_name:['', Validators.required],
      nickname:['', Validators.required],
      birth_date:['', Validators.required],
      phone_number:'',
      email:['', Validators.required],
      street:['', Validators.required],
      street1:'',
      city:['', Validators.required],
      state:['', Validators.required],
      country:['', Validators.required],
      zip:['', Validators.required],
      timezone:['', Validators.required],
      clock_display:['', Validators.required],
      preferred_language:['', Validators.required],
      second_language:'',
      specialities : [ this.fb.array([
      ]), Validators.minLength(1)],
      educations:this.fb.array([
      ]),
      certifications:this.fb.array([
      ]),
      short_description:['', Validators.required],
      price_week:['', Validators.required],
      description:'',
      photo:''
    },{ 
      validator : minLengthArrValidator
    });
  }

  setForm(){
    let _model = this.beforeSetForm();
    this.trainerForm.setValue(_model); 
  }

  initilizeFormArray(){
    let arr = [];
    let obj={text:''};
    let fobj={file:''};
    let education = this.model.education;
    let certification = this.model.certifications;

    if(education.trim() !== ''){
      education.split(',').forEach((a) => {
        arr.push(this.fb.group(obj));
      });
      this.trainerForm.setControl('educations', this.fb.array(arr));
    }
    arr = [];
    if(certification.trim() !== ''){
      certification.split(',').forEach((a) => {
        arr.push(this.fb.group(fobj));
      });
      this.trainerForm.setControl('certifications', this.fb.array(arr));
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

  
  beforeSetForm(){

    this.initilizeFormArray(); 

    let rObj = {};
    let specialities = [];
    let educations = [];
    let certifications = [];
    
    if(this.model['specialities'] && this.model['specialities'].trim() !== ''){
      for(let attr of this.spArr){
        let obj = {};
        obj[attr.value] = this.model['specialities'].indexOf(attr.value) >= 0; 
        specialities.push(obj);
      }
    }
    if(this.model['education'] && this.model['education'].trim() !== ''){
      let eduArr = this.model['education'].split(',');
      for(let attr of eduArr){
        let obj = {
          text:attr
        };
        educations.push(obj);
      }
    }

    if(this.model['certifications'] && this.model['certifications'].trim() !== ''){
      let eduArr = this.model['certifications'].split(',');
      for(let attr of eduArr){
        let obj = {
          file:attr
        };
        certifications.push(obj);
      }
    }

    let _street = this.model['street'].split(',');
    rObj['first_name'] = this.model['first_name'];
    rObj['last_name'] = this.model['last_name'];
    rObj['nickname'] = this.model['nick_name'];
    rObj['phone_number'] = this.model['phone_number'];
    rObj['email'] = this.model['email'];
    rObj['birth_date'] = (this.model['birth_date'])? this.model['birth_date'] :'';
    rObj['photo'] = (this.model['photo'])? this.model['photo'] :'';
    rObj['street'] = _street[0];
    rObj['street1'] = (_street[1])?_street[1]:'';
    rObj['country'] = (this.model['country'])?this.model['country']:'';
    rObj['state'] = (this.model['state'])?this.model['state']:'32';
    rObj['city'] = (this.model['city'])?this.model['city']:'';
    rObj['zip'] = (this.model['zip'])?this.model['zip']:'';
    rObj['timezone'] = (this.model['timezone'])?this.model['timezone']:'GMT+04:30';
    rObj['clock_display'] = (this.model['clock_display'])?this.model['timezone']:'24';
    rObj['preferred_language'] = (this.model['perferred_languages'] && this.model['perferred_languages']!== "undefined")?this.model['perferred_languages']:'en';
    rObj['second_language'] = (this.model['additional_language'])?this.model['additional_language']:'';
    rObj['specialities'] = specialities;
    rObj['educations'] = educations,
    rObj['certifications'] = certifications;
    rObj['short_description'] = this.model['description'];
    rObj['description'] = this.model['addtional_description'];
    rObj['price_week'] = this.model['weeklyprice'];
    
    return rObj;
  }


  setData(){
    this.data.getLanguages().subscribe(x=>this.allLanguages=x);
    this.data.getTimezones().subscribe(x=>this.allTimezones=x);
    this.data.getCountries().subscribe(x=> this.allCountries=x);
    this.data.getStates().subscribe(x=>{
      this.allStates=x;
      this.states = this.allStates.filter(x => x.country_id === this.model.country);
    });
  }
  
  addCertificate(event){
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

  deleteCertificate(i:number){
    (this.trainerForm.get('certifications') as FormArray).removeAt(i);
  }

  addEducation(){
    (this.trainerForm.get('educations') as FormArray).push(this.fb.group({
      text:''
    }));
  }

  deleteEducation(i:number){
    (this.trainerForm.get('educations') as FormArray).removeAt(i);
  }

  refreshStates(event){
    this.states = this.allStates.filter(x => x.country_id === event.target.value);
  }

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

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
	}

	imageCropped(image: string) {
		this.croppedImage = image;
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

  beforeSave(){
    let formModel  = this.trainerForm.value;
    this.model['first_name'] = formModel.first_name;
    this.model['last_name'] = formModel.last_name;
    this.model['nickname'] = formModel.nickname;
    this.model['birth_date'] = formModel.birth_date;
    this.model['phone_number'] = formModel.phone_number;
    this.model['email'] = formModel.email;

    this.model['city'] = formModel.city;
    this.model['country'] = formModel.country;
    this.model['street'] = formModel.street + ',' +  formModel.street1;
    this.model['state'] = formModel.state;
    this.model['zip'] = formModel.zip;

    this.model['perferred_languages'] = formModel.preferred_language;
    this.model['additional_language'] = (formModel.second_language && formModel.second_language !== "undefined")?formModel.second_language:'';
    

    this.model['specialities'] = formModel.specialities.filter(arr => {
      for(let a in arr)
        return arr[a];
    }).map(arr => {
      for(let a in arr)
        return a;
    });

    this.model.education = formModel.educations.map(arr => arr.text);
    this.model.certifications = formModel.certifications.map(arr => arr.file);

    this.model['description'] = formModel.short_description;

    this.model['weeklyprice'] = formModel.price_week;

    this.model['photo'] = formModel.photo;

    this.model['addtional_description'] = formModel.description;

  }


  onSave(){
    if(this.trainerForm.valid){
      this.beforeSave();
      this.save.emit(this.model);
    }
  }

  ngOnInit() {
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
