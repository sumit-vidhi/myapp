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
		private socialAuth : SocialAuthService,
		private storage : StorageService,
		private message:MessageService,
		private router : Router,
		private loader : LoaderService
	){}

	loginForm : FormGroup;
	serverErrorMessages:Array<string>;
	dismissible = true;

	signInWithGoogle(): void {
		let self = this;
    	this.socialAuth
		.signIn(GoogleLoginProvider.PROVIDER_ID)
		.then((user) => {
			self.api.connect(user)
			.then((resp) => {
				if(resp.code == 200){
					self.router.navigate(['/']);			
				}
			})
		});
  	}

  	signInWithFB(): void {
  		let self = this;
    	this.socialAuth
		.signIn(FacebookLoginProvider.PROVIDER_ID)
		.then((user) => {
			self.api.connect(user)
			.then((res) => {
				if(res.code == 200){
					self.auth.setToken(res.data);	
					self.auth.login();		
				}else{
					console.log('internal server error');
				}
			})
		});
  	}

	onSubmit(){
		this.loader.show();
		setTimeout(() => this.loader.hide(), 3000);
		// let self = this;
		// let formModal = this.loginForm.value;
		// this.api.login(formModal)
		// .then(function(res){
		// 	if(res.code === 200){
		// 		self.auth.setToken(res.data);	
		// 		self.auth.login();	
		// 	}else{
		// 		console.log('internal server error');
		// 		//self.serverErrorMessages.push('Either email or password is wrong');
		// 	}	
		// })

		
	}
	
	ngOnInit() {
		this.serverErrorMessages = [];
  		this.loginForm = this.fb.group({	
  			username : ['', Validators.required],
		 	password : ['', Validators.required],
		 	rememberMe :['']
		});
		console.log('ng init start');
		
		this.message.getMessage()
		.subscribe(x => console.log('message in login' + x ));
	}
}
