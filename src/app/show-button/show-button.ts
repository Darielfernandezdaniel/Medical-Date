import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, Location } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-show-button',
  imports: [],
  templateUrl: './show-button.html',
  styleUrl: './show-button.css'
})
export class ShowButton {
  
  constructor(private router: Router, private location: Location, @Inject(PLATFORM_ID) private platformId: Object) {}
  sectionInfo:string = "";

  goBack() {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']); 
    }
  }
}
