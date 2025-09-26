import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BrowserStorageServices } from '../Services/browser-storage-services';
import { AuthStatus } from '../Services/auth-status';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-navigation-bar-right',
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation-bar-right.html',
  styleUrl: './navigation-bar-right.css',
})
export class NavigationBarRight implements OnInit {
  isAuth:boolean = false ;
  email: string | null = null;
  iconToShow: string = "";
  private destroy$ = new Subject<void>();

  constructor(private storage: BrowserStorageServices, private authStatus: AuthStatus,
     private router: Router,
     private cdr: ChangeDetectorRef,) {}
    

     ngOnInit() {
      this.decideRoute();
      this.authStatus.isAuthenticated$
        .pipe(takeUntil(this.destroy$))
        .subscribe((auth: boolean) => {
          this.isAuth = auth;
          this.cdr.detectChanges();
        });
    }

  decideRoute(){
    const currentRoute = this.router.url; 
    if (currentRoute.includes('patient')){
      this.iconToShow = 'home',
      this.cdr.detectChanges()
    }else if (currentRoute === '/'){
      this.iconToShow = 'patient',
      this.cdr.detectChanges()
    }
  }

  async logOut() {
    await this.authStatus.logOut();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
