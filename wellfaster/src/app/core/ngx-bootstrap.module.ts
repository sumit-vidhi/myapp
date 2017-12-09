import { NgModule } from '@angular/core';

import { AlertModule } from 'ngx-bootstrap/alert';
import { ButtonsModule } from 'ngx-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap';
import { PaginationModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap';
import { PopoverModule } from 'ngx-bootstrap';
import { TooltipModule } from 'ngx-bootstrap';

@NgModule({
	imports: [
		AlertModule,
		ButtonsModule,
		BsDropdownModule,
		ModalModule,
		PaginationModule,
		TabsModule,
		PopoverModule,
		TooltipModule
	]
})

export class NgxBootstrapModule {	
}
