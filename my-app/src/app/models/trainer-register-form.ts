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
	licence:string;
	video:string;
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
	addresses:string[];
	short_description:string;
	price_week:number;
	price_premiumweek:number;
	pricesubscription_week:number;
	pricesubscription_premiumweek:number;
	description:string;
	bank_name:number;
	registration_number:string;
	account_number:number;
	swift:string;
	iban:number;
	cvr_vat:string;
	role:number;
	action:string;

	constructor(){
		this.role = 2;
		this.action = 'register';
	}
}
