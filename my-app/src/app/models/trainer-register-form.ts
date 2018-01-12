export class TrainerRegisterForm {
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
	specialities:string[];
	educations:string[];
	certifications:string[];
	short_description:string;
	price_week:number;
	description:string;
	role:number;
	action:string;

	constructor(){
		this.role = 2;
		this.action = 'register';
	}
}
