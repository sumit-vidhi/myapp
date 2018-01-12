export class LoginForm {
	username : string;
	password : string;
	rememberMe : boolean;

	constructor(){
		this.username = '';
		this.password = '';
		this.rememberMe = false;
	}
}
