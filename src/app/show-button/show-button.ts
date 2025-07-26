import { Component } from '@angular/core';
import { ShowSectionInfo } from '../Services/show-section-info';

@Component({
  selector: 'app-show-button',
  imports: [],
  templateUrl: './show-button.html',
  styleUrl: './show-button.css'
})
export class ShowButton {
  
  constructor(private showInfo: ShowSectionInfo) {}
  sectionInfo:string = "";

  showSectionInfo(arg0: string) {
    this.showInfo.setSectionInfo( arg0) 
  }
}
