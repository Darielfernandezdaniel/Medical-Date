import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SectionInfo } from "../section-info/section-info";
import { CommonModule } from '@angular/common';
import { CharityComponent } from "../charity-component/charity-component";

@Component({
  selector: 'app-meet-us',
  imports: [RouterModule, SectionInfo, CommonModule, CharityComponent],
  templateUrl: './meet-us.html',
  styleUrl: './meet-us.css'
})
export class MeetUs {

  sectionInfo:string = "";

  showSectionInfo(arg0:string){
    this.sectionInfo = arg0;
  }
}
