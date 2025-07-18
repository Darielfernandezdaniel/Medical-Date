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
  animating = false;
  params:string = "";

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const newParam = params.get('params');
      if (newParam) {
        this.params = newParam;
      }
    });
  }
  constructor(private route: ActivatedRoute){}

  paramsChanger(target: 'login' | 'join') {
    if (this.params === target) return;
  
    this.animating = true;
  
    setTimeout(() => {
      this.params = target;
      this.animating = false;
    }, 500); // debe coincidir con la animación CSS
  }
}
