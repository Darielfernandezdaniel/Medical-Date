import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { fieldsMatchValidator } from '../Custom-Validators/Match-Validator';
import { passwordStrengthValidator } from '../Custom-Validators/Password-Character-Validator';
import { noWhitespaceValidator } from '../Custom-Validators/no-whitespace.validator';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-form.html',
  styleUrls: ['./register-form.css']
})
export class RegisterForm {

  animating = false;
  params:string = "";
  private destroy$ = new Subject<void>();
  RegisterForm!: FormGroup;

  ngOnInit() {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const param = params.get('params');
      const validParam = param === 'join' || param === 'login' ? param : 'join';
      
      this.params = validParam;
      this.formInicializer(validParam);
    });
   }
  constructor(private route: ActivatedRoute, private fb: FormBuilder){}

  paramsChanger(target: 'login' | 'join') {
    if (this.params === target) return;
  
    this.animating = true;
    this.formInicializer(target)
  
    setTimeout(() => {
      this.params = target;
      this.animating = false;
    }, 500); // debe coincidir con la animación CSS
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  formInicializer(formType: 'join' | 'login'){
    
    if(formType === 'join'){
      this.RegisterForm = this.fb.group({
        password: ['', [Validators.required, Validators.minLength(6), passwordStrengthValidator(),  Validators.maxLength(15), noWhitespaceValidator()]],
        repitPassword: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        rememberMe:[false]
      }, 
      { 
        validators: fieldsMatchValidator('password', 'repitPassword') 
      });
    
    }else if(formType === 'login'){
      this.RegisterForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6), passwordStrengthValidator(),  Validators.maxLength(15), noWhitespaceValidator()]],
        rememberMe:[false]
      });
    }
  }

    enviarDataJoin() {
      console.log(this.RegisterForm.value)
    }
    enviarDataLogin() {
      console.log(this.RegisterForm.value)
    }
}
