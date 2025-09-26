import { Component} from '@angular/core';
import { NavigaionBar } from "../navigaion-bar/navigaion-bar";
import { Presentation } from "../presentation/presentation";
import { MedicalInsuranceComponent } from "../medical-insurance/medical-insurance";
import { ContactArea } from "../contact-area/contact-area";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-component',
  imports: [NavigaionBar, Presentation, MedicalInsuranceComponent, ContactArea, RouterModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css'
})
export class HomeComponent {
  
}
