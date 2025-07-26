import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShowSectionInfo {
  private sectionInfoSubject = new BehaviorSubject<string | null> (null);

  sectionInfo = this.sectionInfoSubject.asObservable();

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.clearSectionInfo(); // Limpia al cambiar de ruta (incluso con la flecha atrás)
      }
    });
  }

  setSectionInfo(value:string){
    this.sectionInfoSubject.next(value);
  }

  clearSectionInfo(){
    this.sectionInfoSubject.next(null)
  }
}
