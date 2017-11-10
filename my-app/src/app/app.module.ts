import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule }   from '@angular/router';
import { FormsModule }    from '@angular/forms';
import { routing }   from './app.routing';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ZipcodeComponent } from './zipcode/zipcode.component';
import { MealplanComponent } from './mealplan/mealplan.component';
import { MealsComponent } from './meals/meals.component';
import { HttpModule } from '@angular/http';
import { MealserviceService } from './mealservice.service';
import { LoginserviceService } from './loginservice.service';
import { PaginationComponent } from './pagination/pagination.component';
import { MealsdetailComponent } from './mealsdetail/mealsdetail.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    LoginComponent,
    HomeComponent,
    ZipcodeComponent,
    MealplanComponent,
    MealsComponent,
    PaginationComponent,
    MealsdetailComponent,
 ],
  imports: [
    BrowserModule,
    RouterModule,
    routing,
    HttpModule,
    FormsModule
  ],
  providers: [MealserviceService,LoginserviceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
