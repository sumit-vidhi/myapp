import { 
	Component, 
	OnInit 
}	 					from '@angular/core';
import { 
	FormBuilder,
	FormGroup,
	Validators 
} 						from '@angular/forms';

import{
	Router 
} 						from '@angular/router';

import { 
	GoogleLoginProvider, 
	FacebookLoginProvider,
	AuthService as SocialAuthService
}						from "angular4-social-login";


import { ApiService } 	from '../../core/api.service';
import { AuthService } 	from '../../core/auth.service';
import { MessageService } from '../../core/message.service';
import { LoaderService } from '../../core/loader.service';
import { StorageService } from '../../core/storage.service';


import { LoginForm } from '../../models/login-form';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
	constructor(
		private fb  : FormBuilder,
		private api : ApiService,
		private auth : AuthService,
		//private socialAuth : SocialAuthService,
		private storage : StorageService,
		private message:MessageService,
		private router : Router,
		private loader : LoaderService
	){}

	loginForm : FormGroup;
	dismissible = true;
	messages:any[];

	// signInWithGoogle(): void {
	// 	let self = this;
    // 	this.socialAuth
	// 	.signIn(GoogleLoginProvider.PROVIDER_ID)
	// 	.then((user) => {
	// 		self.api.connect(user)
	// 		.then((resp) => {
	// 			if(resp.code == 200){
	// 				self.router.navigate(['/']);			
	// 			}
	// 		})
	// 	});
  	// }

  	// signInWithFB(): void {
  	// 	let self = this;
    // 	this.socialAuth
	// 	.signIn(FacebookLoginProvider.PROVIDER_ID)
	// 	.then((user) => {
	// 		self.api.connect(user)
	// 		.then((res) => {
	// 			if(res.code == 200){
	// 				self.auth.setToken(res.token);	
	// 				self.auth.login();		
	// 			}else{
	// 				console.log('internal server error');
	// 			}
	// 		})
	// 	});
	  // }
	  
	isFieldValid(field:string):boolean{
		return this.loginForm.get(field).invalid && (
			this.loginForm.get(field).dirty ||
			this.loginForm.get(field).touched);
	}  

	onSubmit(){
		let self = this;
		self.loader.show();
		let formModal = self.loginForm.value;
		self.api.login(formModal)
		.then(function(res){
			self.loader.hide();
			if(res.code === 200){
				self.auth.setToken(res.data);	
				self.auth.login();	
			}else{
				if(res.message === 'account_confirmation_error'){
					self.setMessage('You need to confirm your account. We have sent you an activation link, please check your email');
				}else{
					self.setMessage('Either email or password is wrong');
				}
				//self.loginForm.reset();
			}						
		})
		.catch(function(err){
			self.loader.hide();	
			//self.loginForm.reset();
			self.setMessage('Received error response from server. Please try again');
		})
	}

	setMessage(message:string){
		this.resetMessage();
		this.messages.push({
			type : 'danger',
			text: message
		});
	}

	resetMessage(){
		this.messages = [];
	}

	ngOnInit() {
		this.resetMessage();
		this.loginForm = this.fb.group({	
  			username : ['', [
				Validators.required,
				Validators.email 
			]],
		 	password : ['', Validators.required],
		 	rememberMe :['']
		});
		
		let _message = this.message.getMessage();
		if(_message) this.messages.push(_message);
	}
}
