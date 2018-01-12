import { NgModule, Pipe, PipeTransform } 	from '@angular/core';
import { BrowserModule } 					from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule }  from '@angular/forms';
import { HttpClientModule } 				from '@angular/common/http';
import { DomSanitizer } 					from '@angular/platform-browser';
import { AlertModule } 						from 'ngx-bootstrap';
import { BsDropdownModule } 				from 'ngx-bootstrap';
import { TabsModule } 						from 'ngx-bootstrap';
import { TooltipModule } 					from 'ngx-bootstrap';
import { BsDatepickerModule } 				from 'ngx-bootstrap';
import { RatingModule } 					from 'ngx-bootstrap';
import { ModalModule } 						from 'ngx-bootstrap';
import { SelectModule} 						from 'angular2-select';
import { TextMaskModule } 					from 'angular2-text-mask';
import { Ng2PageScrollModule } 				from 'ng2-page-scroll';


import { ImageCropperModule } from 'ngx-image-cropper';

import { 
	SocialLoginModule, 
	AuthServiceConfig,
	GoogleLoginProvider, 
	FacebookLoginProvider 
} 											from "angular4-social-login";

import * as $	 							from 'jquery';
import * as braintree	 					from 'braintree-web';
import * as _ 								from 'underscore';


/***********************************
 | IMPORING MODULES
 ***********************************/

	import { AppRoutingModule } 			from './app-routing.module';
	import { AdminRoutingModule } 			from './admin-routing.module';
	import { CoreModule } 					from './core/core.module';
	import { CNF } 							from './core/config';

/***********************************
 | IMPORING DIRECTIVES
 ***********************************/



/***********************************
 | IMPORING COMPONENTS
 ***********************************/

import { AppComponent } 			from './app.component';
import { PageNotFoundComponent } 	from './pages/page-not-found/page-not-found.component';

import { SiteComponent } from './pages/site/site.component';
import { SiteLayoutComponent } from './layouts/site-layout/site-layout.component';
import { SiteHeaderComponent } from './layouts/site-header/site-header.component';
import { SiteFooterComponent } from './layouts/site-footer/site-footer.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { RegisterUserComponent } from './pages/register-user/register-user.component';
import { RegisterTrainerComponent } from './pages/register-trainer/register-trainer.component';
import { RegisterListComponent } from './pages/register-list/register-list.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { MessageComponent } from './pages/message/message.component';
import { RegisterFinishComponent } from './pages/register-finish/register-finish.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { AlertComponent } from './pages/alert/alert.component';
import { TrainerListComponent } from './pages/trainer-list/trainer-list.component';
import { TrainerDetailComponent } from './pages/trainer-detail/trainer-detail.component';
import { EmailVarificationComponent } from './pages/email-varification/email-varification.component';
import { LoaderComponent } from './pages/loader/loader.component';
import { HomeComponent } from './pages/home/home.component';
import { AccountComponent } from './pages/account/account.component';
import { UserFormComponent } from './pages/user-form/user-form.component';
import { TrainerFormComponent } from './pages/trainer-form/trainer-form.component';
import { PageComponent } from './pages/page/page.component';

import { DialogComponent } from './pages/dialog/dialog.component';
import { RequestComponent } from './pages/request/request.component';
import { LogoFooterComponent } from './pages/logo-footer/logo-footer.component';
import { HeaderSearchComponent } from './pages/header-search/header-search.component';
import { ChangePasswordComponent } from './pages/changepassword/change-password.component';

@Pipe({ name: 'safeHtml'})

export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

const config = new AuthServiceConfig([
	{
		id: GoogleLoginProvider.PROVIDER_ID,
		provider: new GoogleLoginProvider(CNF.GOOGLE.CLIENT_ID)
	},
	{
		id: FacebookLoginProvider.PROVIDER_ID,
		provider: new FacebookLoginProvider(CNF.FACEBOOK.APP_ID)
	}
]);

export function provideConfig() {
	return config;
}

@NgModule({
	imports : [ 
		BrowserModule, 
		FormsModule, 
		ReactiveFormsModule,
		HttpClientModule, 
		AlertModule.forRoot(),
		BsDropdownModule.forRoot(),
		TabsModule.forRoot(),
		BsDatepickerModule.forRoot(),
		TooltipModule.forRoot(),
		RatingModule.forRoot(),
		ModalModule.forRoot(),
		AdminRoutingModule,
		AppRoutingModule,
		CoreModule.forRoot(),
		SocialLoginModule,
		ImageCropperModule,
		SelectModule,
		TextMaskModule,
		Ng2PageScrollModule
	],
	declarations : [ 
		SafeHtmlPipe,
		AppComponent,
		SiteComponent,
		PageNotFoundComponent,
		SiteLayoutComponent,
		SiteHeaderComponent,
		SiteFooterComponent,
		LoginComponent,
		RegisterComponent,
		RegisterUserComponent,
		RegisterTrainerComponent,
		RegisterListComponent,
		NavbarComponent,
		PaymentComponent,
		MessageComponent,
		RegisterFinishComponent,
		ForgotPasswordComponent,
		ResetPasswordComponent,
		AlertComponent,
		TrainerListComponent,
		TrainerDetailComponent,
		EmailVarificationComponent,
		LoaderComponent,
		HomeComponent,
		AccountComponent,
		UserFormComponent,
		TrainerFormComponent,
		PageComponent,
		DialogComponent,
		RequestComponent,
		LogoFooterComponent,
		HeaderSearchComponent,
		ChangePasswordComponent
	],
	providers: [
		{ provide: AuthServiceConfig, useFactory: provideConfig}
	],
	bootstrap : [ AppComponent ]
})


export class AppModule {
	constructor(){
		console.log('app module called');
	}
}

