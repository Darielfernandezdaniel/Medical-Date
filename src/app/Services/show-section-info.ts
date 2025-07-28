import { Injectable } from '@angular/core';
import { NavigationStart, Router, Event } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShowSectionInfo {
  private sectionInfoSubject = new BehaviorSubject<string | null>(null);
  sectionInfo = this.sectionInfoSubject.asObservable();

  private routerSubscription?: Subscription;

  constructor(private router: Router) {}

  setSectionInfo(value: string) {
    this.sectionInfoSubject.next(value);

    if (value !== null && !this.routerSubscription) {
      // Si hay valor y no hay suscripción, me suscribo a router events
      this.routerSubscription = this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          this.clearSectionInfo();
        }
      });
    }
  }

  clearSectionInfo() {
    this.sectionInfoSubject.next(null);

    // Si hay suscripción, la cancelo porque ya no hay valor
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
      this.routerSubscription = undefined;
    }
  }
}