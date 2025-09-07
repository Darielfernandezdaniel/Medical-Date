import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { NavigaionBar } from "../navigaion-bar/navigaion-bar";
import { Presentation } from "../presentation/presentation";
import { MedicalInsuranceComponent } from "../medical-insurance/medical-insurance";
import { ContactArea } from "../contact-area/contact-area";
import { BrowserStorageServices } from '../Services/browser-storage-services';

import { Router, RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthStatus } from '../Services/auth-status';

@Component({
  selector: 'app-home-component',
  imports: [NavigaionBar, Presentation, MedicalInsuranceComponent, ContactArea, RouterModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css'
})
export class HomeComponent {
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

      try {
        await this.auth.logOut();
      } catch (err) {
        console.warn('Cognito ya no estaba logueado o error:', err);
      }
    }
  }
}
