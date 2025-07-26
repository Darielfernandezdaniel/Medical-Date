import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SectionInfo } from "../section-info/section-info";
import { CommonModule } from '@angular/common';
import { CharityComponent } from "../charity-component/charity-component";
import { ShowSectionInfo } from '../Services/show-section-info';

@Component({
  selector: 'app-meet-us',
  imports: [RouterModule, SectionInfo, CommonModule, CharityComponent],
  templateUrl: './meet-us.html',
  styleUrl: './meet-us.css'
})
export class MeetUs {
  sectionInfo: string | null | undefined;

  constructor(private showInfo: ShowSectionInfo){}

  ngOnInit() {
    this.showInfo.sectionInfo.subscribe(value => {
      this.sectionInfo = value;
    });
  }

  showSectionInfo(arg0:string){
    this.showInfo.setSectionInfo(arg0)
  }
}
