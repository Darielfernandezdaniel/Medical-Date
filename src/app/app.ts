import { Component, signal, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from './auth/store/actions/auth.actions';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Medical_Date');

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(AuthActions.checkAuth());
  }
}
