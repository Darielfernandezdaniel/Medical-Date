import { Component } from '@angular/core';
import { NavigaionBar } from "../navigaion-bar/navigaion-bar";
import { Calendar } from "../calendar/calendar";
import { OurTechnologi } from "../our-technologi/our-technologi";

@Component({
  selector: 'app-patient-area',
  imports: [NavigaionBar, OurTechnologi],
  templateUrl: './patient-area.html',
  styleUrl: './patient-area.css'
})
export class PatientArea {

}
