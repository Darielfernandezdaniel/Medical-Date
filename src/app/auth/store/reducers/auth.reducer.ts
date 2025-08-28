import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';

export interface AuthState {
  isAuthenticated: boolean;
  email?: string;
}

export const initialState: AuthState = {
  isAuthenticated: false, 
  email: undefined
};

export const authReducer = createReducer(
  initialState,

  // Login exitoso
  on(AuthActions.loginSuccess, (state, { email }) => ({
    ...state,
    isAuthenticated: true,
    email,
    error: null
  })),

  on(AuthActions.setAuth, (state, { isAuthenticated, email }) => ({
    ...state,
    isAuthenticated,
    email: email || undefined
  })),

  // Logout exitoso
  on(AuthActions.logoutSuccess, state => ({
    ...state,
    isAuthenticated: false,
    email: undefined,
    error: null
  })
))
