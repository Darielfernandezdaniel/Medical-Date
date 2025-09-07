import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStatus } from './Services/auth-status';
import { BrowserStorageServices } from './Services/browser-storage-services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App  {
  protected readonly title = signal('Medical_Date');

  constructor(private authStatus: AuthStatus, private storageService: BrowserStorageServices) {}

 
}
