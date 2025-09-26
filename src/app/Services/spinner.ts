import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Spinner {
  private _spinner = new BehaviorSubject<boolean>(false);

  // Observable que pueden suscribirse los componentes
  spinner$ = this._spinner.asObservable();

  constructor() { }

  // Mostrar el spinner
  show(): void {
    this._spinner.next(true);
  }

  // Ocultar el spinner
  hide(): void {
    this._spinner.next(false);
  }
}
