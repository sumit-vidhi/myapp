import { InjectionToken } from '@angular/core';

const _isDev = window.location.port.indexOf('4200') > -1;

const protocol = window.location.protocol;

const host = window.location.host;

const apiURI = _isDev ? 'http://localhost:3001/api/' : '/api/';
const chaturi = _isDev ? 'http://localhost:3001' : '';
//const apiURI = _isDev ? 'http://52.169.75.115:3001/api/' : '/api/';
//const apiURI = 'http://52.169.249.146:3001/api/';

export const CNF = {
	appName : 'WellFaster',
  	BASE_URI: protocol + "//" + host + '/',
	BASE_API: apiURI,
	CHAT:chaturi,
  	GOOGLE: {
  		CLIENT_ID : '463694952815-de19uf0rdgk2s7o7or3jpda2b5kvg35v.apps.googleusercontent.com'
  	},
  	FACEBOOK: {
  		APP_ID : '211620949402339'
  	} 
};

