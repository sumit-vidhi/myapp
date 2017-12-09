import { 
	Component, 
	ViewEncapsulation, 
	OnInit 
} 							from '@angular/core';

import { AlertService }     from './core/alert.service';
import { AuthService }     from './core/auth.service';

@Component({
	selector : 'app-root',
	templateUrl: './app.component.html',
	styles : ['./app.component.css'],
	providers:[AlertService]
})

export class AppComponent implements OnInit {

	constructor( private auth : AuthService){}
	
	alerts:any=[];

	ngOnInit() {
		this.auth.handleAuth();
	}
}