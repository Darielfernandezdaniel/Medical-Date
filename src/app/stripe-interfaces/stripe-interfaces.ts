import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { StripeComponenteDownload } from '../Services/stripe-componente-download';
import { ActivatedRoute } from '@angular/router';
import { Spinner } from '../Services/spinner';
import { Spin } from "../spinner/spinner";
import { Subject } from 'rxjs';

@Component({
  selector: 'app-stripe-interfaces',
  imports: [CommonModule, Spin],
  templateUrl: './stripe-interfaces.html',
  styleUrl: './stripe-interfaces.css'
})
export class StripeInterfaces implements OnInit, OnDestroy {
  titulo: string = "";
  private isProcessing = false;
  private destroy$ = new Subject<void>();
  private url = "https://j9waftd27c.execute-api.eu-central-1.amazonaws.com/default/StripePayments"

  constructor(
    private stripeService: StripeComponenteDownload,
    private route: ActivatedRoute,
    private spin: Spinner,
  ) {}

  ngOnInit() {

    let tituloParam = this.route.snapshot.paramMap.get('test');
    if (tituloParam) {
      this.titulo = tituloParam;
    }

    // 3️⃣ TERCERO: Iniciar proceso de pago
    if (!this.isProcessing && this.titulo) {
      this.pagar();
    }
  }

  ngOnDestroy() {
    console.log('🧹 Destruyendo componente StripeInterfaces');
    this.destroy$.next();
    this.destroy$.complete();
  }

  async pagar() {
    if (this.isProcessing) {
      console.log('⚠️ Pago ya en proceso, ignorando...');
      return;
    }

    if (!this.titulo) {
      console.error('❌ No hay título de prueba definido');
      alert("Error: No se especificó qué prueba pagar");
      return;
    }

    this.isProcessing = true;
    this.spin.show();
    
    console.log('💰 Iniciando proceso de pago para:', this.titulo);

    try {
      await this.stripeService.checkout(this.titulo, this.url);
      console.log('🚀 Checkout iniciado correctamente');
      
    } catch (error) {
      console.error('💥 Error en el proceso de pago:', error);
      alert("Error iniciando el pago. Por favor intenta nuevamente.");
      
    } finally {
      this.isProcessing = false;
      this.spin.hide();
    }
  }
}