import { Injectable }     		from '@angular/core';
import { 
	CanActivate, 
	Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot 
}    							from '@angular/router';

import { AuthService }      	from './auth.service';

@Injectable()

export class AuthGuard implements CanActivate {

  	constructor(private authService: AuthService, private router: Router) {}

  	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    	let url: string = state.url;

    	return this.checkLogin(url);
  	}

    checkLogin(url: string): boolean {
    	if (this.authService.isLoggedIn) { return true; }

    	// Store the attempted URL for redirecting
		this.authService.redirectUrl = url;
		//console.log(url.indexOf("trainers"));
        if(url.indexOf("trainers")>-1){ 
			//console.log(121212);
            window.localStorage.setItem("detail",url);
	    }else{
			window.localStorage.removeItem("detail");
		}
    	// Navigate to the login page with extras
    	this.router.navigate(['/login']);
    	return false;
  	}
}