import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



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
import { MessageComponent } 		from './pages/message/message.component';
import { HomeComponent } 			from './pages/home/home.component';
import { AccountComponent } 		from './pages/account/account.component';
import { TrainerListComponent } 	from './pages/trainer-list/trainer-list.component';
import { TrainerDetailComponent } 	from './pages/trainer-detail/trainer-detail.component';
import { PageNotFoundComponent }	from './pages/page-not-found/page-not-found.component';

const routes: Routes = [
  	{ path: '', 
  		component: SiteLayoutComponent,
  		children : [
  			{ path:'', component: SiteComponent, pathMatch:'full' }
		],
		pathMatch : 'full'
	},
	// { 
	// 	path: 'trainers', 
	// 	component: RegisterComponent,
	// 	children : [
	// 		{ path:':id', component: RegisterFinishComponent},
	// 		{ path:'', component: RegisterListComponent, pathMatch:'full' }
	// 	]
	// },  
  	{ 
  		path: 'register', 
  		component: RegisterComponent,
		children : [
			{ path:'user', component: RegisterUserComponent},
			{ path:'trainer', component: RegisterTrainerComponent},
			{ path:'finish', component: RegisterFinishComponent},
			{ path:'', component: RegisterListComponent, pathMatch:'full' }
		]
  	},
	{ path: 'login', component: LoginComponent },
	{ path: 'forgot_password', component: ForgotPasswordComponent },
	{ path: 'reset_password/:id/:code', component: ResetPasswordComponent },
	{ path: 'email_varification/:id/:code', component: EmailVarificationComponent },
	{ path: 'home', component: HomeComponent },
	{ path: 'account', component: AccountComponent },
	{ path: 'payment', component: PaymentComponent },
	{ path: 'message', component: MessageComponent },
	{ path: 'trainers', component: TrainerListComponent },
	{ path: 'trainers/:id', component: TrainerDetailComponent },
	{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
  	exports: [ RouterModule ]
})


export class AppRoutingModule {}