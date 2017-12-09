import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http'

import 'rxjs/add/operator/toPromise';

import { CNF } from './config';

import { StorageService } from './storage.service';

/*
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
*/

@Injectable()

export class ApiService {

  	constructor(
		private http : HttpClient,
		private storage : StorageService
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
		console.log(options);
		return new HttpHeaders(options);
	}

	public register ( data : any ) : Promise<any> {
		return this.httpPost(CNF.BASE_API + 'user/signup', data);			
	}

	public login	( data : any ) : Promise<any> {
		return this.httpPost(CNF.BASE_API + 'user/login', data);
	}

	public confirm	( data : any ) : Promise<any> {
		return this.httpPost(CNF.BASE_API + 'user/validate', data);
	}

	public confirmToken	( data : any ) : Promise<any> {
		return this.httpPost(CNF.BASE_API + 'user/check_requset', data);
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

	public myProfile ( ) : Promise<any> {
		var token = this.storage.get('access_token');
		var headers = this.headers(token);
		return this.httpGet(CNF.BASE_API + 'user/me', headers);
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
