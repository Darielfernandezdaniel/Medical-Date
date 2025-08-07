import { PassedInitialConfig } from 'angular-auth-oidc-client';

export const authConfig: PassedInitialConfig = {
  config: {
              authority: 'https://t0fituncl.auth.eu-central-1.amazoncognito.com',              redirectUrl: window.location.origin,
              postLogoutRedirectUri: window.location.origin,
              clientId: '5ahthn4tr1clkgk2ddc71695e9',
              scope: 'please-enter-scopes', // 'openid profile offline_access ' + your scopes
              responseType: 'code',
              silentRenew: true,
              useRefreshToken: true,
              renewTimeBeforeTokenExpiresInSeconds: 30,
  }
}



