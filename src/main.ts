import { bootstrapApplication} from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { App } from './app/app';
import { provideAuth } from 'angular-auth-oidc-client';
import { authConfig } from './app/auth/auth.config';
import { amplifyConfig } from './app/auth/Amplify';
import { Amplify } from 'aws-amplify';
import { appConfig } from './app/app.config';

Amplify.configure(amplifyConfig);

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    provideRouter(routes),
    provideAuth(authConfig),
    ...(appConfig.providers || [])
  ]
});
