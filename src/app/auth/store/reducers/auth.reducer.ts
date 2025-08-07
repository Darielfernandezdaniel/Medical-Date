import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';

export interface AuthState {
  isAuthenticated: boolean;
  error: any | null;
}

export const initialState: AuthState = {
  isAuthenticated: true, // o false si estás deslogueado inicialmente
  error: null
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.logoutSuccess, state => ({ ...state, isAuthenticated: false })),
  on(AuthActions.logoutFailure, (state, { error }) => ({ ...state, error }))
);