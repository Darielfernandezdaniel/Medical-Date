import { Component, signal, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStatus } from './Services/auth-status';
import { BrowserStorageServices } from './Services/browser-storage-services';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App  {
  protected readonly title = signal('Medical_Date');
  authChecked = false;

  constructor(
    private storage: BrowserStorageServices,
    private auth: AuthStatus,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  async ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
   
    const authData = this.storage.getValidAuthData();
    if (!authData?.isValid) {
      this.storage.clearAuthData();
      this.authChecked = true;
      try {
        await this.auth.logOut();
      } catch (err) {
        console.warn('Cognito ya no estaba logueado o error:', err);
      }finally {
        this.authChecked = true;
      }
    } else {
      this.authChecked = true;
    }
  }}
