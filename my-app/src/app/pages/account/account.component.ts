import { 
	Component, 
	OnInit,
	ViewEncapsulation 
} 							from '@angular/core';
import { Inject, ViewChild,  ElementRef } from '@angular/core';
import { DOCUMENT} from '@angular/common';
import { AuthService }		from '../../core/auth.service';
import { LoaderService }		from '../../core/loader.service';
import { ApiService }		from '../../core/api.service';
import { UserProfile }		from '../../models/user-profile';
import { MessageService } from '../../core/message.service';
import { StorageService } from '../../core/storage.service';
import { PageScrollConfig, PageScrollService, PageScrollInstance } from 'ng2-page-scroll';
declare function escape(s:string): string;
declare function unescape(s:string): string;
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  encapsulation: ViewEncapsulation.None
  
})

export class AccountComponent implements OnInit {
	@ViewChild('myDiv') myDiv: ElementRef;
	model : any;
	rmodel : any;
	dismissible = true;
	messages:any[];

	constructor(
		public auth : AuthService, 
		private api : ApiService, 
		private loader : LoaderService,
		private storage : StorageService,
		private message:MessageService,
		private pageScrollService: PageScrollService, 
		@Inject(DOCUMENT) private document: any
	){
		this.goToSearch();
	}

	onSave(rModel){
		this.resetMessage();
		let self = this;
		self.loader.show();
		self.api.saveMyProfile(rModel)
		.then(function(res){
			self.loader.hide();
			if(res.code === 200) {
				self.auth.updateProfile();
				self.setMessage('Your account is updated successfully');
				self.goToSearch();
			}else{
				if(res.message=="user_not"){
                  self.auth.logout();
				}else{
					self.setMessage('Your account is not updated. Please try again');
				}
			
			}
		})
		.catch(function(){
			self.loader.hide();
			self.setMessage('Server is not responding right now. Please try again');
		})
	}
	
	public goToSearch(): void {
		let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#accountform');
		this.pageScrollService.start(pageScrollInstance);
	  }; 

	setMessage(message:string){
		this.resetMessage();
		this.messages.push({
			type : 'success',
			text: message
		});
	}

	resetMessage(){
		this.messages = [];
	}

	ngOnInit(){
	
		if(this.auth.user.role=='2' && (this.auth.user.approve=='comment' || this.auth.user.approve=='' ||  this.auth.user.approve==null)){
			let el: HTMLElement = this.myDiv.nativeElement as HTMLElement;
			el.click();	
		}
		
		this.auth.handleAuth();
		this.goToSearch();
		
		this.auth.user.addtional_description=unescape(this.auth.user.addtional_description);
		this.auth.user.description=unescape(this.auth.user.description);
		this.model = this.auth.user;	
		let _message = this.message.getMessage();
		if(_message) this.messages.push(_message);
	
	}
}
