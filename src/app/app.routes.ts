import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { RegisterForm } from './register-form/register-form';
import { AuthGuard } from './Guards/auth.guard';
import { NoReloadGuard } from './Guards/noReloadGuard';

export const routes: Routes = [
  
    {path: '', component: HomeComponent,},
    {path: 'ticket/:params',
        loadComponent: () =>
          import('./ticket/ticket').then(m => m.Ticket)
      },
      {path: 'MeetUs',
        loadComponent: () =>
          import('./meet-us/meet-us').then(m => m.MeetUs)
      },
      {path: 'patient', 
        loadComponent: () =>
          import('./patient-area/patient-area').then(m => m.PatientArea), canActivate: [AuthGuard]
      },
      {path: "register/:params", component: RegisterForm},
      {
        path: 'insurance/:index',
        loadComponent: () =>
          import('./section-info/section-info').then(m => m.SectionInfo)
      },
      {
        path: 'insurance',
        loadComponent: () =>
          import('./section-info/section-info').then(m => m.SectionInfo)
      },
      {path: 'charity',
        loadComponent: () =>
          import('./charity-component/charity-component').then(m => m.CharityComponent)
      },
      {path: 'stripe/:test',
        loadComponent: () =>
          import('./stripe-interfaces/stripe-interfaces').then(m => m.StripeInterfaces)
      },
      {path: 'payment',
        loadComponent: () =>
          import('./payment-status-confirmation/payment-status-confirmation').then(m => m.PaymentStatusConfirmation), canActivate: [NoReloadGuard]
      }
];
