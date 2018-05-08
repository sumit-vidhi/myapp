import { NgModule } 				    from '@angular/core';
import { Routes, RouterModule } 	from '@angular/router';	
import { AccountComponent } 		from './pages/account/account.component';
import { TrainerListComponent } 		from './pages/trainer-list/trainer-list.component';
import { ChangePasswordComponent } 		from './pages/changepassword/change-password.component';
import { PaymentComponent } 		from './pages/payment/payment.component';
import { PaymentStatusComponent } 		from './pages/payment-status/payment-status.component';
import { AuthGuard }             from './core/auth-guard.service';
import { PaymentGuard }             from './core/payment-guard.service';
import { SubscriptionComponent } 		from './pages/subscription/subscription.component';
import { RequestsComponent } 		from './pages/requests/requests.component';
import { UserdetailsComponent } 		from './pages/userdetails/userdetails.component';
import { TraineesComponent } 		from './pages/trainees/trainees.component';

//after login define routing
const adminRoutes: Routes = [
  { path : 'account', component : AccountComponent, canActivate: [AuthGuard] },
  { path : 'my-trainers', component : TrainerListComponent, canActivate: [AuthGuard] },
  { path : 'chat', component : TrainerListComponent, canActivate: [AuthGuard] }, 
  { path : 'trainees', component : TraineesComponent, canActivate: [AuthGuard] }, 
  { path : 'change-password', component : ChangePasswordComponent, canActivate: [AuthGuard] },
  { path : 'subscription', component : SubscriptionComponent, canActivate: [AuthGuard] },
  { path : 'requests', component : RequestsComponent, canActivate: [AuthGuard] },
  { path: 'payment/:id', component: PaymentComponent,canActivate: [PaymentGuard] },
  { path: 'users-details/:id', component: UserdetailsComponent,canActivate: [AuthGuard] },
	{ path: 'payment_status/:id/:id2', component: PaymentStatusComponent,canActivate: [PaymentGuard] },

];

@NgModule({
  imports: [
    RouterModule.forRoot(adminRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class AdminRoutingModule {}