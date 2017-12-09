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
import { AlertService }		from '../../core/alert.service';
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
    private alert:AlertService,
    private router : Router,
    private message:MessageService
  ) { }


  forgotForm: FormGroup;
	dismissible = true;

  onSubmit(){
    // let self = this;
    // let formModel = this.forgotForm.value;
    // this.api.request(formModel)
    // .then(function(res){
    //   if(res.code === 200){
    //     self.serverErrorMessages
    //       .push('Reset password instructions has been sent to your email address'); 
    //   }    
    //   else{
    //     self.serverErrorMessages
    //       .push('We have no account for this email, Please try again with other email.');
    //   } 
    // })
    this.alert.success('Sorry your email');
		this.router.navigate(['/login']);

  }

  ngOnInit() {
    this.forgotForm = this.fb.group({	 
      email 	: ['', [
        Validators.required,
        Validators.email
      ]]
    });  

    this.message.getMessage()
    .subscribe(x => console.log('message in forgot' + x ));
  }
}
