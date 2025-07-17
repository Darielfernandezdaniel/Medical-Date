import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { RegisterForm } from './register-form/register-form';

export const routes: Routes = [
    {path: '', component: HomeComponent,},
    {path: "register", component: RegisterForm}
];
