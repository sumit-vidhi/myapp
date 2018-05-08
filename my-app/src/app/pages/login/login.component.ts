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
	dismissible = true;
	messages:any[];
	

	/*
	function name : signInWithGoogle
	Service : socialAuth,api
	Explain:Google login
   */

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


	/*
	function name : signInWithFB
	Service : socialAuth,api,storage,auth
	Explain :Facebook login
   */
  	signInWithFB(): void {
  		let self = this;
    	this.socialAuth
		.signIn(FacebookLoginProvider.PROVIDER_ID)
		.then((user) => {
			self.loader.show();
			self.api.connect(user)
			.then((res) => {
				self.loader.hide();
				if(res.code == 200){
					if(res.message=="newuser"){
						this.storage.save("first_name",user.firstName);
						this.storage.save("last_name",user.lastName);
						this.storage.save("facebook_id",user.id);
						this.storage.save("email",user.email);
						this.storage.save("photo",user.photoUrl);
						self.router.navigate(['/register']);
					  }else if(res.message=="existuser"){
						self.auth.setToken(res.token);	
						self.auth.login();
					  }		
				}else{
					console.log('internal server error');
				}
			})
		});
	  }
	  
	  /*
	function name : isFieldValid
	Explain :this function use for validation
	@param field 
   */
	isFieldValid(field:string):boolean{
		return this.loginForm.get(field).invalid && (
			this.loginForm.get(field).dirty ||
			this.loginForm.get(field).touched);
	} 

	
	/*
	function name : onSubmit
	Service : api,auth
	Explain :this function use for user/trainer login with email and password
   */

	onSubmit(){
		let self = this;
		self.loader.show();
		let formModal = self.loginForm.value;
		self.api.login(formModal)
		.then(function(res){
			self.loader.hide();
			if(res.code === 200){
				console.log(res.data);
				self.auth.setToken(res.data);

				console.log(window.localStorage.getItem("detail"));
				if(window.localStorage.getItem("detail")!=null){
					self.auth.detailpage();
				
				}else{
					self.auth.login();	
				}
										
			}else{
				if(res.message === 'account_confirmation_error'){
					self.setMessage('You need to confirm your account. We have sent you an activation link, please check your email');
				}else if(res.message === 'username_notexist'){
					self.setMessage('We cannot find an account with that email address.');
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


	/*
	function name : setMessage
	Explain :this function use for set confirmation message ex. "email and password is incorrect"
	@param message 
   */

	setMessage(message:string){
		this.resetMessage();
		this.messages.push({
			type : 'danger',
			text: message
		});
	}

	/*
	function name : resetMessage
	Explain :this function use for reset confirmation message
   */

	resetMessage(){
		this.messages = [];
	}

	/*
	function name : ngOnInit
	Explain :this function use for create login form 
   */

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
