import { Injectable } from '@angular/core';

import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { StorageService }   from './storage.service';

export class AuthInterceptor implements HttpInterceptor {
	
	constructor (
		private storage : StorageService
	){}

  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  	let token = this.storage.get('access_token');

  	if(token){
  		const authReq = req.clone({
      		setHeaders: { 
      			Authorization : token
      		}
    	});	
    	return next.handle(authReq);
  	}else{
  		return next.handle(req);
  	}
  }
}