import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './register-form.html',
  styleUrls: ['./register-form.css']
})
export class RegisterForm {
  // param:string = "";

  // ngOnInit(){
  //   this.param = this.route.snapshot.paramMap.get('param')!
  // }

  // constructor(private route: ActivatedRoute){}
}
