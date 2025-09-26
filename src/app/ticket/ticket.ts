import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForSendEmail } from '../Services/for-send-email';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Spin } from "../spinner/spinner";
import { Spinner } from '../Services/spinner';

@Component({
  selector: 'app-ticket',
  imports: [CommonModule, ReactiveFormsModule, Spin],
  templateUrl: './ticket.html',
  styleUrl: './ticket.css',
  providers:[ForSendEmail]
})
export class Ticket implements OnDestroy {
  animating = false;
  params: 'telephone' | 'email' = "email";
  TicketForm!: FormGroup;
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute, 
    private fb: FormBuilder, 
    private cdr: ChangeDetectorRef, 
    private emailSender: ForSendEmail,
    private spin: Spinner
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const param = params.get('params');
        const validParam = param === 'telephone' || param === 'email' ? param : 'email';
        this.params = validParam;
        this.formInicializer(validParam);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  Changer(target: "telephone" | "email") {
    this.cdr.detectChanges();
    if (this.params === target) return;
    
    this.animating = true;      
    this.formInicializer(target);
    
    setTimeout(() => {
      this.params = target;
      this.animating = false;
      this.cdr.detectChanges();
    }, 500); // debe coincidir con la animación CSS
  }

  formInicializer(formType: 'telephone' | 'email'){
    if(formType === 'telephone'){
      this.TicketForm = this.fb.group({
        telephone: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.maxLength(15)]],
        telephoneIden: ['', [Validators.required, Validators.pattern(/^\d{1,3}$/)]],
        name: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
        email: ['', [Validators.required, Validators.email]]
      });
    }else{
      this.TicketForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]]
      });
    }
  }

  async onSubmit() {
    if (this.TicketForm.valid) {
      this.spin.show()
      const formData = this.TicketForm.value;
      const dataToSend = {
        email: formData.email,
        nombreCompleto: formData.name,
        telefono: formData.telephone ? `+${formData.telephoneIden} ${formData.telephone}` : undefined
      };
      try {
        const result = await this.emailSender.sendTicket(dataToSend);
        this.spin.hide()
        console.log("✅ Ticket enviado:", result);
        alert("Ticket enviado con éxito");
      } catch (err) {
        this.spin.hide()
        alert("Error enviando el ticket");
      }
    }
  }
}
