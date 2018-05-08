import { Component, OnInit } from '@angular/core';

import { DOCUMENT} from '@angular/common';
import { Inject, ViewChild,  ElementRef } from '@angular/core';
import { 
	FormBuilder, 
  FormGroup,
  FormArray,
  Validators,
  AbstractControl
} 							              from '@angular/forms';
import { FormControl } from '@angular/forms/src/model';
import { ApiService }		  from '../../core/api.service';
import { LoaderService }  from '../../core/loader.service';


import { AuthService }       from '../../core/auth.service';

import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';

function passwordMatchValidator(g: FormGroup) {
   return g.get('password').value === g.get('confirm_password').value
      ? null : {'mismatch': true};
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
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {


  regForm1 : FormGroup;
  errormessage:any;
  sucessmessage:any;
  constructor( private fb  : FormBuilder, private api	: ApiService,
    private loader : LoaderService,
    private pageScrollService: PageScrollService,
    
    public auth : AuthService, 
		@Inject(DOCUMENT) private document: any) { }

  ngOnInit() {
    this.auth.handleAuth();
    this.regForm1 = this.fb.group({	 
      oldpassword 	: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
      ]],
      password 	: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
      ]],
      confirm_password : ['', Validators.required]
    },{ 
      validator : passwordMatchValidator
    });
    this.goToSearch();
  }

  isFieldValid(form:string, field:string){
    switch(form){
      case 'regForm1' : {
        return this.regForm1.get(field).invalid && ( 
          this.regForm1.get(field).dirty || 
          this.regForm1.get(field).touched);	
      }
    
    }
  }

  public goToSearch(): void {
		let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#passform');
		this.pageScrollService.start(pageScrollInstance);
	  }; 

  changepassword(form:FormGroup){
   
    const formModal = form.value;
    this.sucessmessage="";
    this.errormessage="";
    let self = this;
    self.loader.show();
    this.api.changepassword(formModal)
    .then(function(res){
      console.log(res);
      if(res.code === 200){
        self.errormessage="";
        self.sucessmessage="Password changed successfully"
        self.loader.hide();
        self.goToSearch();
      }else if(res.code === 100){
        if(res.message=="user_not"){
          self.auth.logout();
        }else{
        self.sucessmessage="";
        self.errormessage="Old Password is wrong ."
        self.loader.hide();
      }
    }
    });
  }

}
