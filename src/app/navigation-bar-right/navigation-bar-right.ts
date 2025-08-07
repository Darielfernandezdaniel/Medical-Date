import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from '../auth/store/actions/auth.actions';
import { CommonModule } from '@angular/common';
import { selectIsAuthenticated } from '../auth/store/selectors/auth.selectors';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation-bar-right',
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation-bar-right.html',
  styleUrl: './navigation-bar-right.css',
})
export class NavigationBarRight {
  isAuthenticated$: Observable<boolean>;

  constructor(private store: Store) {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  logOut() {
    this.store.dispatch(AuthActions.logout());
  }
}
