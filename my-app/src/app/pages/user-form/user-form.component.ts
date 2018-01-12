import { 
  Component, 
  OnInit, 
  Input,
  Output,
  EventEmitter,
  TemplateRef  
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

import { setTimeout } from 'timers';

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

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

  rModel : any;
  userForm : FormGroup;
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

  showImageLoader=false;

  constructor(
    private fb : FormBuilder, 
    private data : DataService, 
    private util : UtilService,
    private api : ApiService,
    private modalService: BsModalService
  ) { }

  createForm(){
    this.userForm =  this.fb.group({
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
      height:['', Validators.required],
      weight:['', Validators.required],
      unit:'',
      sleep_senstivity:['', Validators.required],
      stride_length:['', Validators.required],
      heart_rate_zones:'',
      start_week:'',
      description:'',
      photo:''
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
    rObj['nickname'] = this.model['nick_name'];
    rObj['phone_number'] = this.model['phone_number'];
    rObj['email'] = this.model['email'];
    rObj['street'] = _street[0];
    rObj['street1'] = (_street[1]) ? _street[1] : '';
    rObj['country'] = (this.model['country'])?this.model['country']:'';
    rObj['state'] = (this.model['state'])?this.model['state']:'32';
    rObj['city'] = (this.model['city'])?this.model['city']:'';
    rObj['zip'] = (this.model['zip'])?this.model['zip']:'';
    rObj['timezone'] = (this.model['timezone'])?this.model['timezone']:'';
    rObj['clock_display'] = (this.model['clock_display'])?this.model['timezone']:'24';
    rObj['preferred_language'] = (this.model['perferred_languages'])?this.model['perferred_languages']:'';
    rObj['second_language'] = (this.model['additional_language'])?this.model['additional_language']:'';
    rObj['photo'] = (this.model['photo'])? this.model['photo'] :'';
    rObj['birth_date'] = (this.model['birth_date'])? this.model['birth_date'] :'';
    rObj['height'] = (this.model['height'])? this.model['height'] :'';
    rObj['weight'] = (this.model['weight'])? this.model['weight'] :'';
    rObj['unit'] = (this.model['unit'])? this.model['unit'] :'';
    rObj['sleep_senstivity'] = (this.model['sleep_sensitivity'] && this.model['sleep_sensitivity'] !== 'undefined')? this.model['sleep_sensitivity'] :'';
    rObj['stride_length'] = (this.model['syride_length'])? this.model['syride_length'] :'';
    rObj['heart_rate_zones'] = (this.model['heart_rate'])? this.model['heart_rate'] :'';
    rObj['start_week'] = (this.model['start_week'])? this.model['start_week'] :'';
    rObj['description'] = (this.model['description'])? this.model['description'] :'';
    return rObj;
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
    this.model['street'] = formModel.street + ',' +  formModel.street1;
    this.model['state'] = formModel.state;
    
    this.model['zip'] = formModel.zip;

    this.model['timezone'] = formModel.timezone;

    this.model['clock_display'] = formModel.clock_display;

    this.model['perferred_languages'] = formModel.preferred_language;
    
    this.model['additional_language'] = (formModel.second_language && formModel.second_language !== "undefined")?formModel.second_language:'';
    
    this.model['height'] =  formModel.height;

    this.model['weight'] =  formModel.weight;

    this.model['units'] =  formModel.unit;

    this.model['sleep_sensitivity'] = (formModel.sleep_senstivity && formModel.sleep_senstivity !== "undefined") ? formModel.sleep_senstivity : '';

    this.model['syride_length'] =  formModel.stride_length;

    this.model['heart_rate'] =  formModel.heart_rate_zones;

    this.model['photo'] = formModel.photo;

    this.model['description'] = formModel.description;
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

  refreshStates(event){
    this.states = this.allStates.filter(x => x.country_id === event.target.value);
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
      self.userForm.get('photo').setValue(res.imageurl);
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

  onSave(){
    if(this.userForm.valid){
      this.beforeSave();
      this.save.emit(this.rModel);
    }
  }

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
