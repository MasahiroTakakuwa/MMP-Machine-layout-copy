import { Routes } from '@angular/router';
import { Access } from './access';
import { LoginComponent } from './login';
import { Error } from './error';
import { RegisterComponent } from './register';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
] as Routes;
