import { Injectable } from '@angular/core';
import { signOut } from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthStatus {
  constructor() {}

  async logOut(): Promise<void>{
    try {
      await signOut();
    }catch(error){
      console.log('error durign sing out:', error);
      throw error
    }
  }
}
