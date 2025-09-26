import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { filter, Subject, takeUntil } from 'rxjs';
import { StripeComponenteDownload } from '../Services/stripe-componente-download';
import { RouterLink } from '@angular/router';
import { Spin } from "../spinner/spinner";
import { Spinner } from '../Services/spinner';
import { BrowserStorageServices } from '../Services/browser-storage-services';

@Component({
  selector: 'app-payment-status-confirmation',
  imports: [RouterLink, Spin],
  templateUrl: './payment-status-confirmation.html',
  styleUrl: './payment-status-confirmation.css',
  encapsulation: ViewEncapsulation.None
})
export class PaymentStatusConfirmation {
  private destroy$ = new Subject<void>();
  statusOfPayment:string = "Aguarde mientras verificamos su pago";
  footer:string | undefined;
  caseImg:string = "";

  constructor(private pollingStripe:StripeComponenteDownload, private cdr: ChangeDetectorRef, private spin:Spinner, private storage: BrowserStorageServices){}
 
  ngOnInit() {
    this.setupPaymentStatusListener();
    this.spin.show();
  }

  private setupPaymentStatusListener() {
   
    this.pollingStripe.paymentStatus$
      .pipe(
        filter(status => status !== null),
        takeUntil(this.destroy$) // Auto-unsubscribe cuando se destruya el componente
      )
      .subscribe({
        next: (status) => {
          console.log('💳 Pago actualizado:', status);
         if(status.status === "assured"){
            this.statusOfPayment = "Todo Asegurado";
            this.footer ="La prueba solicitada se encuentra dentro de la cobertura actual. Para retornar al apartado de citas haga click en el siguiente botón ";
            this.caseImg = "assets/portapapeles.png";
            this.spin.hide()
            this.cdr.markForCheck()
          }
            else if (status.success) {
            this.statusOfPayment = "Su pago ha sido Aceptado";
            this.footer ="Agradecemos la confianza en nosotros. Para retornar al apartado de citas haga click en el siguiente botón ";
            this.caseImg = "assets/exito.avif";
            this.spin.hide()
            this.cdr.markForCheck()
          }
          else {
            this.statusOfPayment = "Algo ha ido mal";
            this.footer ="Vuelva a intentarlo en el apartado de Citas o contacte a soporte mediante un ticket. Para retornar al apartado de citas haga click en el siguiente botón ";
            this.caseImg = "assets/multiplicar.avif";
            this.spin.hide()
            this.cdr.markForCheck()
          }
        },
        error: (error) => {
          console.error('❌ Error en payment status listener:', error);
          alert("Error verificando el estado del pago.");
        }
      });
       // Marcar que ya visitamos esta ruta
      this.storage.setLocalItem('payment-visited', "true");
      this.spin.hide();
  }

  ngOnDestroy() {
    console.log('🧹 Destruyendo componente StripeInterfaces');
    this.destroy$.next();
    this.destroy$.complete();
  }
}
