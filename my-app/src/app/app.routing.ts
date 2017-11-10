import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MealplanComponent } from './mealplan/mealplan.component';
import { MealsComponent } from './meals/meals.component';
import { MealsdetailComponent } from './mealsdetail/mealsdetail.component';

const appRoutes: Routes = [

    { path: '', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'mealplan', component: MealplanComponent },
    { path: 'meals', component: MealsComponent },
    { path: 'mealsdetail/:id', component: MealsdetailComponent },

];

export const routing = RouterModule.forRoot(appRoutes);