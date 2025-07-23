import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SectionInfo } from "../section-info/section-info";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meet-us',
  imports: [RouterModule, SectionInfo, CommonModule],
  templateUrl: './meet-us.html',
  styleUrl: './meet-us.css'
})
export class MeetUs {

  sectionInfo:boolean = false;

  showSectionInfo(arg0:boolean){
    this.sectionInfo = arg0;
  }
}
