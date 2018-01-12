import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http'

import 'rxjs/add/operator/toPromise';

import 'rxjs/add/operator/timeout';

import { CNF } from './config';

import { StorageService } from './storage.service';

import { UtilService } from './util.service';

/*
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
*/

@Injectable()

export class ApiService {

  	constructor(
		private http : HttpClient,
		private storage : StorageService,
		private util : UtilService
	) { }

	public headers(token?:string){
		var options = {};
		if(token){
			options = { 
				'Content-Type': 'application/json',
				'Authorization': token 
			};
		}else{
			options = { 
				'Content-Type': 'application/json'
			};
		}
		return new HttpHeaders(options);
	}

	public register ( data : any ) : Promise<any> {
		return this.httpPost(CNF.BASE_API + 'user/signup', data);			
	}

	public login	( data : any ) : Promise<any> {
		return this.httpPost(CNF.BASE_API + 'user/login', data);
	}

	public logout() : Promise<any> {
		var token = this.storage.get('access_token');
		var headers = this.headers(token);
		return this.httpGet(CNF.BASE_API + 'user/logout', headers);
	}

	public confirm	( data : any ) : Promise<any> {
		return this.httpPost(CNF.BASE_API + 'user/validate', data);
	}

	public confirmToken	( data : any ) : Promise<any> {
		return this.httpPost(CNF.BASE_API + 'user/check_requset', data);
	}

	public checkEmailToken	( data : any ) : Promise<any> {
		return this.httpPost(CNF.BASE_API + 'user/emailcheck', data);
	}

	public resend	( data : any ) : Promise<any> {
		return this.httpPost(CNF.BASE_API + 'user/resend', data);	
	}

	public reset	( data : any ) : Promise<any> {
		return this.httpPost(CNF.BASE_API + 'user/reset', data);
	}

	public request	( data : any ) : Promise<any> {
		return this.httpPost(CNF.BASE_API + 'user/request', data);
	}

	public connect	( data : any ) : Promise<any> {
		return this.httpPost(CNF.BASE_API + 'user/connect', data);
	}

	public uploadImage  ( data : any ) : Promise<any> {
		return this.httpPost(CNF.BASE_API + 'user/uploadImage', data);
	}

	/**
	 * Get Logged user Profile
	 */	
	public myProfile ( ) : Promise<any> {
		var token = this.storage.get('access_token');
		var headers = this.headers(token);
		let url = CNF.BASE_API + 'user/me?t=' + this.util.time(); 
		return this.httpGet(url, headers);
	}
	/**
	 * Save Logged User Profile
	 * @param data 
	 */
	public saveMyProfile  ( data : any ) : Promise<any> {
		var token = this.storage.get('access_token');
		var headers = this.headers(token);
		return this.httpPost(CNF.BASE_API + 'user/update_profile', data, headers);
	}

	public myUsers ( ) : Promise<any> {
		var token = this.storage.get('access_token');
		var headers = this.headers(token);
		return this.httpGet(CNF.BASE_API + 'user/me?t='+this.util.time(), headers);
	}

	public getTrainers (data:any ) : Promise<any> {
		var token = this.storage.get('access_token');
		var headers = this.headers(token);
		return this.httpPost(CNF.BASE_API + 'user/get_trainers_listing',data, headers);
	}

	public getTrainerdetail (data:any ) : Promise<any> {
		var token = this.storage.get('access_token');
		var headers = this.headers(token);
		return this.httpPost(CNF.BASE_API + 'user/get_trainers_detail',data, headers);
	}

	public acceptRequest (data:any ) : Promise<any> {
		return this.httpPost(CNF.BASE_API + 'user/accept_trainer',data);
	}

	public hireTrainer (data:any ) : Promise<any> {
		var token = this.storage.get('access_token');
		var headers = this.headers(token);
		return this.httpPost(CNF.BASE_API + 'user/hire_trainer',data, headers);
	}

	public getHiredTrainers () : Promise<any> {
		var token = this.storage.get('access_token');
		var headers = this.headers(token);
		return this.httpGet(CNF.BASE_API + 'user/get_hire_trainer_user?t='+this.util.time(), headers);
	}

	public saveReview (data:any ) : Promise<any> {
		var token = this.storage.get('access_token');
		var headers = this.headers(token);
		return this.httpPost(CNF.BASE_API + 'user/savereview',data, headers);
	}

	public sendMessage (data:any ) : Promise<any> {
		var token = this.storage.get('access_token');
		var headers = this.headers(token);
		return this.httpPost(CNF.BASE_API + 'user/addmessage',data, headers);
	}

	public getMessages (data:any ) : Promise<any> {
		var token = this.storage.get('access_token');
		var headers = this.headers(token);
		return this.httpPost(CNF.BASE_API + 'user/get_message_trainer_user',data, headers);
	}

	private httpPost( url : string, data : any, headers?:any ) : Promise<any> {
		if(! headers){
			headers = this.headers();
		}
		return 	this.http
					.post( url, data, { headers : headers })
					.toPromise()
					.catch(this.handleError);
	}

	private httpGet	( url : string, headers?:any ) : Promise<any> {
		if(! headers){
			headers = this.headers();
		}
		return 	this.http
					.get(url, { headers : headers })
					.toPromise()
					.catch(this.handleError);
	}

	private handleError(error: any): Promise<any> {
		console.error('An error occurred', error); // for demo purposes only
		return Promise.reject(error.message || error);
	}

}
