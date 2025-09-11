import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { StripeComponenteDownload } from '../Services/stripe-componente-download';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-stripe-interfaces',
  imports: [CommonModule],
  templateUrl: './stripe-interfaces.html',
  styleUrl: './stripe-interfaces.css'
})
export class StripeInterfaces {
  titulo:string = "";

  constructor(private stripeService: StripeComponenteDownload, private route: ActivatedRoute,) {}

  ngOnInit() {
    const tituloParam = this.route.snapshot.paramMap.get('titulo');
    if (tituloParam) {
      this.titulo = tituloParam;
    }
  }

  async pagar() {
    await this.stripeService.checkout(this.titulo);
  }
}