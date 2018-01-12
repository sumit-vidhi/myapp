import { 
	Component, 
	OnInit,
	ViewEncapsulation 
} 							from '@angular/core';

import { AuthService }		from '../../core/auth.service';
import { LoaderService }		from '../../core/loader.service';
import { ApiService }		from '../../core/api.service';
import { UserProfile }		from '../../models/user-profile';
import { MessageService } from '../../core/message.service';
import { StorageService } from '../../core/storage.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  encapsulation: ViewEncapsulation.None
  
})

export class AccountComponent implements OnInit {

	model : any;
	rmodel : any;
	dismissible = true;
	messages:any[];

	constructor(
		private auth : AuthService, 
		private api : ApiService, 
		private loader : LoaderService,
		private storage : StorageService,
		private message:MessageService,
	){}

	onSave(rModel){
		let self = this;
		self.loader.show();
		self.api.saveMyProfile(rModel)
		.then(function(res){
			self.loader.hide();
			if(res.code === 200) {
				self.auth.updateProfile();
				self.setMessage('Your account is updated successfully');
			}else{
				self.setMessage('Your account is not updated. Please try again');
			}
		})
		.catch(function(){
			self.loader.hide();
			self.setMessage('Server is not responding right now. Please try again');
		})
	}
	
	setMessage(message:string){
		this.resetMessage();
		this.messages.push({
			type : 'danger',
			text: message
		});
	}

	resetMessage(){
		this.messages = [];
	}

	ngOnInit(){
		this.model = this.auth.user;	
		let _message = this.message.getMessage();
		if(_message) this.messages.push(_message);
	}
}
