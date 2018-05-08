import { 
	Component, 
	ViewEncapsulation, 
	OnInit,
	HostListener
} 							from '@angular/core';
import { ChatService }      from './core/chat.service';
import { AlertService }     from './core/alert.service';
import { AuthService }     from './core/auth.service';
@Component({
	selector : 'app-root',
	templateUrl: './app.component.html',
	styles : ['./app.component.css'],
	providers:[AlertService]
})

export class AppComponent implements OnInit { 
	
	constructor( private auth : AuthService,private chatservice:ChatService){
	
	}
	
	
	alerts:any=[];

	

	ngOnInit() {
		
		// when user login on website then show online in chat module
		this.chatservice.getRequests().subscribe(data=>{  
		
			this.auth.handleAuth();
			
		})
	
		this.auth.handleAuth();

		}
	
}