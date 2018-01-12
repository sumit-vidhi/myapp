import { Component, OnInit } from '@angular/core';

import { 
	FormBuilder, 
	FormGroup,
	Validators
} 							from '@angular/forms';

import { 
	Router 
} 							from '@angular/router';



import { ApiService }		from '../../core/api.service';
import { MessageService }		from '../../core/message.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})


export class ForgotPasswordComponent implements OnInit {

  constructor(
    private fb : FormBuilder,
    private api : ApiService,
    private router : Router,
    private message:MessageService
  ) { }


  forgotForm: FormGroup;
	dismissible = true;

  onSubmit(){
    let self = this;
    let formModel = this.forgotForm.value;
    this.api.request(formModel)
    .then(function(res){
      if(res.code === 200){
        self.message.success('Reset password instructions has been sent to your email address. Please check your email'); 
      }    
      else{
        self.message.error('We have no account for this email, Please try again with other email.');
      } 
      self.router.navigate(['/login']);
    })
    .catch(function(err){
      self.message.error('Received error response from server. Please try again');
      self.router.navigate(['/login']);
    })
  }

  ngOnInit() {
    this.forgotForm = this.fb.group({	 
      email 	: ['', [
        Validators.required,
        Validators.email
      ]]
    });    
  }
}
