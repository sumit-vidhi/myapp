import { NgModule, ModuleWithProviders } from '@angular/core';

import { ApiService } from './api.service';
import { UtilService } from './util.service';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { AlertService } from './alert.service';
import { LoaderService } from './loader.service';
import { StorageService } from './storage.service';
import { MessageService } from './message.service';


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
				MessageService  
      		]
    	}
    }	
}
