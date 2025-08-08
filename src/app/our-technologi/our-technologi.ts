import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestInfo } from '../Interfaces/Insurances';
import { TestInfoService } from '../Services/test-info';
import { FormsModule } from '@angular/forms';
import { NavigationBarLeft } from "../navigation-bar-left/navigation-bar-left";
import { NavigationBarRight } from "../navigation-bar-right/navigation-bar-right";

@Component({
  selector: 'app-our-technologi',
  imports: [CommonModule, FormsModule, NavigationBarLeft, NavigationBarRight],
  templateUrl: './our-technologi.html',
  styleUrls: ['./our-technologi.css']
})
export class OurTechnologi implements AfterViewInit {
  selectedInfo: TestInfo | null = null;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  opcionesTexto!: string;
  NgModelVariable: string = '';
  openModal: boolean = false;
  private resolverSeleccion!: (valor: string) => void;
  private rechazarSeleccion!: (razon?: any) => void;
  unicVar: boolean = false;

  constructor(private mediTest: TestInfoService) {}

  ngAfterViewInit() {
  }
      
  cancelarSeleccion() {
    this.openModal = false;
    this.NgModelVariable = '';
    if (this.rechazarSeleccion) {
      this.rechazarSeleccion('cancelado');
    }
  }

  // Método común para procesar la información
  private procesarImagenInfo(altText: string): void {
    // CLAVE: Primero poner null y esperar un tick completo
    this.selectedInfo = null;
    
    setTimeout(() => {
      this.mediTest.getInfoByAlt(altText).subscribe((info: TestInfo | undefined) => {
        this.selectedInfo = info ?? null;
      });
    }, 5);
  }

  selectedInfoFromModal(opcion:string){
    this.openModal = false;
    this.unicVar = true
    this.procesarImagenInfo(opcion);
  }

  sendImageId(event: Event): void {
    this.openModal = false;
    this.unicVar = true
    const target = event.target as HTMLImageElement;
    const altText = target.alt;
    this.procesarImagenInfo(altText);
  }

  async buscarPrueba(valor: string) {
    const busqueda = valor.toLowerCase().trim();
    
    
    if (!this.scrollContainer) {
      return;
    }
    
    const imagenes = this.scrollContainer.nativeElement.querySelectorAll('img');
    const coincidencias: {img: HTMLImageElement, puntuacion: number, tipo: string}[] = [];
    
    for (const img of imagenes) {
      const alt = img.alt?.toLowerCase().trim();
      if (!alt) continue;
      
      let puntuacion = 0;
      let tipo = '';
      
      // 1. Coincidencia exacta (mayor puntuación)
      if (alt === busqueda) {
        puntuacion = 100;
        tipo = 'exacta';
        
      }
      // 2. Coincidencia parcial (contiene la búsqueda)
      else if (alt.includes(busqueda)) {
        puntuacion = 80;
        tipo = 'contiene';
      }
      // 3. Búsqueda contiene parte del alt
      else if (busqueda.includes(alt)) {
        puntuacion = 70;
        tipo = 'contenida';
      }
      // 4. Palabras individuales coinciden
      else {
        const palabrasBusqueda = busqueda.split(' ');
        const palabrasAlt = alt.split(' ');
        let palabrasCoinciden = 0;
        palabrasBusqueda.forEach(palabra => {
          if (palabrasAlt.some((altPalabra: string) => altPalabra.includes(palabra) || palabra.includes(altPalabra))) {
            palabrasCoinciden++;
          }
        });
        if (palabrasCoinciden > 0) {
          puntuacion = (palabrasCoinciden / palabrasBusqueda.length) * 60;
          tipo = 'palabras';
        }
      }
      
      // 5. Similitud por caracteres (para typos)
      if (puntuacion === 0) {
        const similitud = this.calcularSimilitud(busqueda, alt);
        if (similitud > 0.6) { // 60% de similitud mínima
          puntuacion = similitud * 50;
          tipo = 'similar';
        }
      }
      
      if (puntuacion > 0) {
        coincidencias.push({img, puntuacion, tipo});
      }
    }
    
    if (coincidencias.length > 0) {
      coincidencias.sort((a, b) => b.puntuacion - a.puntuacion);
      const mejor = coincidencias[0];
    
      if (mejor.puntuacion === 100) {
        // Caso 1: Coincidencia perfecta
        this.procesarImagenInfo(mejor.img.alt);
      } else {
        // Caso 2 y 3: Una o varias coincidencias no perfectas → mostrar modal
        const opcionesArray = coincidencias.slice(0, 4).map(c => c.img.alt);
        this.opcionesTexto = opcionesArray.join('\n- ');
        this.NgModelVariable = '';
        this.selectedInfo = null;
        this.openModal = true;
      }

    }else{
      alert("Intente con un término más especifico")
    }
  }
      private calcularSimilitud(str1: string, str2: string): number {
        const matriz: number[][] = [];
        const len1 = str1.length;
        const len2 = str2.length;
    // Inicializar matriz
    for (let i = 0; i <= len1; i++) {
      matriz[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
      matriz[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const costo = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matriz[i][j] = Math.min(
          matriz[i - 1][j] + 1,      // eliminación
          matriz[i][j - 1] + 1,      // inserción
          matriz[i - 1][j - 1] + costo // sustitución
        );
      }
    }
    
    const distancia = matriz[len1][len2];
    const longitudMaxima = Math.max(len1, len2);
    
    // Convertir distancia a similitud (0-1)
    return 1 - (distancia / longitudMaxima);
  }
}