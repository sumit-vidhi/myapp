import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PreventLoggedinAccess } 	from './core/prevent-loggedin-access.service';

import { SiteLayoutComponent } 		from './layouts/site-layout/site-layout.component';
import { LoginComponent } 			from './pages/login/login.component';
import { SiteComponent } 			from './pages/site/site.component';
import { RegisterComponent }		from './pages/register/register.component';
import { RegisterListComponent }	from './pages/register-list/register-list.component';
import { RegisterUserComponent }	from './pages/register-user/register-user.component';
import { RegisterTrainerComponent }	from './pages/register-trainer/register-trainer.component';
import { RegisterFinishComponent }	from './pages/register-finish/register-finish.component';
import { ForgotPasswordComponent } 	from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } 	from './pages/reset-password/reset-password.component';
import { EmailVarificationComponent }from './pages/email-varification/email-varification.component';
import { PaymentComponent } 		from './pages/payment/payment.component';
import { TrainerDetailComponent } 	from './pages/trainer-detail/trainer-detail.component';
import { PageComponent }			from './pages/page/page.component';
import { RequestComponent }			from './pages/request/request.component';
import { PageNotFoundComponent }	from './pages/page-not-found/page-not-found.component';

const routes: Routes = [
  	{ path: '', 
  		component: SiteLayoutComponent,
  		children : [
			  { path:'', component: SiteComponent, pathMatch:'full' }
			  
		],
		pathMatch : 'full'
	},
	{ 
  		path: 'register', 
  		component: RegisterComponent,
		children : [
			{ path:'user', component: RegisterUserComponent},
			{ path:'trainer', component: RegisterTrainerComponent},
			{ path:'finish', component: RegisterFinishComponent},
			{ path:'', component: RegisterListComponent, pathMatch:'full' }
		],
		canActivate : [PreventLoggedinAccess]
  	},
	{ path: 'login', component: LoginComponent,canActivate : [PreventLoggedinAccess] },
	{ path: 'forgot_password', component: ForgotPasswordComponent,canActivate : [PreventLoggedinAccess] },
	{ path: 'reset_password/:id/:code', component: ResetPasswordComponent,canActivate : [PreventLoggedinAccess] },
	{ path: 'email_varification/:id/:code', component: EmailVarificationComponent,canActivate : [PreventLoggedinAccess] },
	{ path: 'payment', component: PaymentComponent },
	{ path: 'trainers/:id', component: TrainerDetailComponent },
	{ path:'pages/:id', component: PageComponent},
	{ path : 'requests/:id/:action', component: RequestComponent },
	{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
  	exports: [ RouterModule ]
})


export class AppRoutingModule {}