import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { BrowserStorageServices } from './browser-storage-services';
import { firstValueFrom, timeout, catchError, BehaviorSubject, interval } from 'rxjs';
import { of, switchMap, takeWhile, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Spinner } from './spinner';

@Injectable({
  providedIn: 'root'
})
export class StripeComponenteDownload {
  private stripe: Stripe | null = null;
  private stripePromise: Promise<Stripe | null>;
  private isCheckoutInProgress = false;
  public paymentStatus$ = new BehaviorSubject<{ success: boolean, status?: string, attempts?: number } | null>(null);

  constructor(
    private http: HttpClient, 
    private storage: BrowserStorageServices,
    private router: Router,
    private spin: Spinner  
  ) {
    // Inicializar Stripe una sola vez
    this.stripePromise = loadStripe('pk_test_51S5a03E25S4ze44aJiefyOiJtLIfiEm57KodPPtNgK8B1pgpDGOYNCqNWNc3tT765Y1MtkCHi9zXo1l21Qiveonx00MdDc2KQR');
    
    // Verificar si hay un pago pendiente al inicializar el servicio
    this.checkPendingPayment();
  }

  async checkout(titulo: string, paymentUrl:string): Promise<void> {
    // Prevenir múltiples ejecuciones simultáneas
    if (this.isCheckoutInProgress) {
      console.warn('Ya hay un proceso de checkout en progreso');
      return;
    }

    this.isCheckoutInProgress = true;

    try {
      // Asegurar que Stripe esté cargado
      if (!this.stripe) {
        this.stripe = await this.stripePromise;
        if (!this.stripe) {
          throw new Error('No se pudo cargar Stripe');
        }
      }

      const email = this.storage.getLocalItem("email") || this.storage.getSessionItem("email");
      
      if (!email) {
        throw new Error('Email no encontrado en storage');
      }
      
      const response = await firstValueFrom(
        this.http.post<{ sessionId: string; asegurado?: boolean, message?: string; 
          seguro?: string  }>(
          paymentUrl,
          { items: titulo, email: email }
        ).pipe(
          timeout(20000), // 20 segundos timeout
          catchError(error => {
            alert("Algo ha fallado. Intentelo nuevamente desde el Apartado para pacientes")
            this.router.navigate(["/patient"])
            throw error;
          })
        )
      );

      if (response.asegurado) {
        console.log("Todo asegurado, no se requiere pago");
        this.paymentStatus$.next({ success: true, status: 'assured' });
        this.router.navigate(['/payment']);
        return;
      }

      if (response.message === 'usuario ya tiene seguro'){
        alert("Usted ya posee dicho seguro")
        setTimeout(() => {
          this.router.navigate(["/patient"])
          this.spin.hide()
        }, 1000);
      }

      if (!response.sessionId) {
        throw new Error('No se recibió sessionId del servidor');
      }

      // Guardar el sessionId para verificar después del redirect
      this.storage.setLocalItem('pending_payment_session', response.sessionId);
      this.storage.setLocalItem('payment_start_time', Date.now().toString());

      // Redirige a Stripe Checkout
      const result = await this.stripe.redirectToCheckout({ 
        sessionId: response.sessionId 
      });
     
      if (result?.error) {
        console.error('Error en redirectToCheckout:', result.error.message);
        // Limpiar datos de pago pendiente si hay error
        this.clearPendingPaymentData();
        throw new Error(result.error.message);
      }

    } catch (error) {
      console.error('Error en checkout:', error);
      this.clearPendingPaymentData();
      this.paymentStatus$.next({ success: false, status: 'error' });
      throw error;
    } finally {
      this.isCheckoutInProgress = false;
    }
  }

  // Verificar si hay un pago pendiente cuando se inicializa la aplicación
  public checkPendingPayment(): void {
    const pendingSession = this.storage.getLocalItem('pending_payment_session');
    const paymentStartTime = this.storage.getLocalItem('payment_start_time');
    
    if (pendingSession && paymentStartTime) {
      const startTime = parseInt(paymentStartTime);
      const currentTime = Date.now();
      const maxWaitTime = 30 * 60 * 1000; // 30 minutos
      
      // Si no ha pasado mucho tiempo, iniciar polling
      if (currentTime - startTime < maxWaitTime) {
        console.log('Detectado pago pendiente, iniciando verificación...');
        this.startPaymentPolling(pendingSession);
      } else {
        // Limpiar datos antiguos
        this.clearPendingPaymentData();
      }
    }
  }

  // Iniciar polling para verificar el estado del pago
  public startPaymentPolling(sessionId: string): void {
    console.log(sessionId)
    const maxAttempts = 5;
    let attempts = 0;

    // Usar interval de RxJS para hacer polling
    interval(2000).pipe(
      switchMap(() => {
        attempts++;
        return this.checkPaymentStatus(sessionId).pipe(
          catchError(error => {
            console.error(`Error en polling intento ${attempts}:`, error);
            return of({ success: null, status: 'error' });
          })
        );
      }),
      takeWhile((result) => {
        // Continuar mientras no tengamos una respuesta definitiva y no hayamos excedido los intentos
        return result.success === null && attempts < maxAttempts;
      }, true), // true para incluir el último valor que cumple la condición
      tap((result) => {
        console.log(`Intento ${attempts}:`, result);
      })
    ).subscribe({
      next: (result) => {
        if (result.success === true) {
          // ✅ Pago exitoso
          this.paymentStatus$.next({ success: true, status: result.status, attempts });
          this.clearPendingPaymentData();
        } else if (result.success === false) {
          // ❌ Pago fallido
          this.paymentStatus$.next({ success: false, status: result.status, attempts });
          this.clearPendingPaymentData();
        } else if (attempts >= maxAttempts) {
          // ⏱️ Timeout
          this.paymentStatus$.next({ success: false, status: 'timeout', attempts });
          this.clearPendingPaymentData();
        }
      },
      error: (error) => {
        console.error('Error en el polling:', error);
        this.paymentStatus$.next({ success: false, status: 'polling_error', attempts });
        this.clearPendingPaymentData();
      }
    });
  }

  // Verificar el estado de un pago específico
  private checkPaymentStatus(sessionId: string) {
    return this.http.get<{ status: string }>(
      `https://nqq58yh3gd.execute-api.eu-central-1.amazonaws.com/default/StripeWebHook?paymentIntentId=${sessionId}`
    ).pipe(
      timeout(5000),
      switchMap(resp => {
        if (resp.status === 'succeeded') {
          return of({ success: true, status: resp.status });
        } else if (resp.status === 'requires_payment_method' || resp.status === 'canceled') {
          return of({ success: false, status: resp.status });
        } else {
          return of({ success: null, status: resp.status });
        }
      })
    );
  }

  // Limpiar datos de pago pendiente
  private clearPendingPaymentData(): void {
    this.storage.removeLocalItem('pending_payment_session');
    this.storage.removeLocalItem('payment_start_time');
  }

  
  resetCheckoutState(): void {
    this.isCheckoutInProgress = false;
    this.clearPendingPaymentData();
  }

  // Limpiar el estado del pago (útil para testing o reset manual)
  resetPaymentStatus(): void {
    this.paymentStatus$.next(null);
  }
}