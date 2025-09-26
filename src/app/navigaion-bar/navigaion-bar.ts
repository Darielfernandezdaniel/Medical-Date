import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationBarLeft } from "../navigation-bar-left/navigation-bar-left";
import { NavigationBarRight } from "../navigation-bar-right/navigation-bar-right";

@Component({
  selector: 'app-navigaion-bar',
  imports: [RouterModule, NavigationBarLeft, NavigationBarRight],
  templateUrl: './navigaion-bar.html',
  styleUrl: './navigaion-bar.css'
})
export class NavigaionBar {

}
