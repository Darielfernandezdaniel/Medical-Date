import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BrowserStorageServices } from '../Services/browser-storage-services';
import { AuthStatus } from '../Services/auth-status';

@Component({
  selector: 'app-navigation-bar-right',
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation-bar-right.html',
  styleUrl: './navigation-bar-right.css',
})
export class NavigationBarRight implements OnInit {
  isAuthenticated:boolean = false ;
  email: string | null = null;

  constructor(private storage: BrowserStorageServices, private authStatus: AuthStatus, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    // Solo ejecutar en navegador
    if (isPlatformBrowser(this.platformId)) {
      const authData = this.storage.getLocalItem('email') || this.storage.getSessionItem('email');
      if (authData) {
        this.isAuthenticated = true;
        this.email = authData;
      } else {
        this.isAuthenticated = false;
        this.email = null;
      }
    }
  }


  async logOut() {
    await this.authStatus.logOut();
    this.isAuthenticated = false;
    this.email = null;
    this.router.navigate(['/']);
  }
}
