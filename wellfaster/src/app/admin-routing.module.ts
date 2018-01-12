import { NgModule } 				    from '@angular/core';
import { Routes, RouterModule } 	from '@angular/router';	

import { AccountComponent } 		from './pages/account/account.component';
import { TrainerListComponent } 		from './pages/trainer-list/trainer-list.component';


import { AuthGuard }             from './core/auth-guard.service';


const adminRoutes: Routes = [
  { path : 'account', component : AccountComponent, canActivate: [AuthGuard] },
  { path : 'my-trainers', component : TrainerListComponent, canActivate: [AuthGuard] },
  { path : 'my-trainees', component : TrainerListComponent, canActivate: [AuthGuard] },

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