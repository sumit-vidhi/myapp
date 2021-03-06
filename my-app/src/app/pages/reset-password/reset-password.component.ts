import { Component, OnInit } from '@angular/core';

import { 
	FormBuilder, 
	FormGroup,
	Validators
} 							from '@angular/forms';

import { 
  Router,
  ActivatedRoute, 
  ParamMap 
} 							from '@angular/router';



import { ApiService }		from '../../core/api.service';
import { MessageService }		from '../../core/message.service';
import { LoaderService } from '../../core/loader.service';

function passwordMatchValidator(g: FormGroup) {
  return g.get('password').value === g.get('confirm_password').value
     ? null : {'mismatch': true};
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(
    private fb : FormBuilder,
    private api : ApiService,
    private router : Router,
    private message:MessageService,
    private loader:LoaderService,
    private route  : ActivatedRoute,
  ) { }

    isValidReset: boolean;
    resetForm: FormGroup;
    dismissible = true;
    
    createForm(){
      this.resetForm = this.fb.group({	 
        user_id: ['', Validators.required],
        password : ['', Validators.required],
        confirm_password : ['', Validators.required]
      },{ 
				validator : passwordMatchValidator
			}); 
    }

    onSubmit(){
      let self = this;
      let formModel = this.resetForm.value;
      self.loader.show();
      this.api.reset(formModel)
      .then(function(res){
        if(res.code === 200) {
          self.loader.hide();
          self.message.success('Your password has reset successfully'); 
          self.router.navigate(['login']);
        }else{
          self.message.error('Internal Server Error. Please try again'); 
        }  
      })
    }
    
    ngOnInit() {
    
      this.isValidReset = false;
      this.createForm();

      this.route.params.subscribe(params => {
        this.api.confirmToken({ 
          id : params.id, 
          token : params.code 
        })
        .then(response => {
          if(response.code == 200){
            this.resetForm.setValue({
              user_id:response.user_id,
              password:'',
              confirm_password:''
            });
            this.isValidReset =true
          }
        })
      })
  }
}
