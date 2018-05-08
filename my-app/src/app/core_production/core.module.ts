import { NgModule, ModuleWithProviders } from '@angular/core';

import { ApiService } from './api.service';
import { UtilService } from './util.service';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { AlertService } from './alert.service';
import { LoaderService } from './loader.service';
import { StorageService } from './storage.service';
import { MessageService } from './message.service';

import { UserService } from './user.service';
import { TrainerService } from './trainer.service';
import { ChatService } from './chat.service';

import { AuthGuard } 	  from './auth-guard.service';
import { PaymentGuard } 	  from './payment-guard.service';
import { PreventLoggedinAccess } from './prevent-loggedin-access.service';


@NgModule()

export class CoreModule { 
	static forRoot(): ModuleWithProviders {
		return {
      		ngModule: CoreModule,
      		providers: [
      			ApiService, 
            	UtilService,
            	AuthService,
            	DataService,
				StorageService,
				AlertService,
				LoaderService,
				MessageService,
				UserService,
				TrainerService,
				ChatService,
				AuthGuard,
				PaymentGuard,
				PreventLoggedinAccess 
      		]
    	}
    }	
}
