export class UserRegisterForm {
	first_name:string;
	last_name:string;
	nickname:string;
	birth_date:string;
	phone_number:string;
	email:string;
	password:string;
	confirm_password:string;
	facebook_id:string;
	photo:string;
	street:string;
	street1:string;
	city:string;
	state:string;
	country:string;
	zip:string;
	timezone:String;
	clock_display:string;
	preferred_language:string;
	second_language:string;

	height:string;
	weight:string;
	unit:string;
	heart_rate_zones:string;
	sleep_senstivity:string;
	stride_length:string;

	//start_week:string;
	description:string;

	action:string;
	role:number;

	constructor(){
		this.action = 'register';
		this.role = 1;
	}
}
