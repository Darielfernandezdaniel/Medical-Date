import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-ticket',
  imports: [CommonModule,  ReactiveFormsModule],
  templateUrl: './ticket.html',
  styleUrl: './ticket.css'
})
export class Ticket {
  animating = false;
  params: 'telephone' | 'email' = "email";

  TicketForm!: FormGroup;

  constructor(private route: ActivatedRoute, private fb: FormBuilder){}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const param = params.get('params');
      const validParam = param === 'telephone' || param === 'email' ? param : 'email';
      
      this.params = validParam;
      this.formInicializer(validParam);
    });
  }

  Changer(target: "telephone" | "email") {
    if (this.params === target) return;
    
    this.animating = true;      
    this.formInicializer(target)
    
    setTimeout(() => {
      this.params = target;
      this.animating = false;
    }, 500); // debe coincidir con la animación CSS
  }

  formInicializer(formType: 'telephone' | 'email'){
    if(formType === 'telephone'){
      this.TicketForm = this.fb.group({
        telephone: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.maxLength(15)]],
        telephoneIden: ['', [Validators.required, Validators.pattern(/^\d{1,3}$/)]],
        name: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]]
      });
    }else if(formType === 'email'){
      this.TicketForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]]
      });
    }
  }

  onSubmit() {
    if (this.TicketForm.valid) {
      console.log('Datos del formulario:', this.TicketForm.value);
    } else {
      console.log('Formulario inválido');
    }
  }
}
