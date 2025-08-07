import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../reducers/auth.reducer';

// 1. Selecciona el *slice* de estado "auth"
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// 2. Selecciona una propiedad específica
export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);