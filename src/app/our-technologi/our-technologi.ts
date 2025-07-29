import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowButton } from '../show-button/show-button';
import { TestInfo } from '../Interfaces/Insurances';
import { TestInfoService } from '../Services/test-info';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-our-technologi',
  imports: [CommonModule, ShowButton, FormsModule],
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

  confirmarSeleccion() {
    if (!this.NgModelVariable?.trim()) {
      alert('Por favor selecciona una opción.');
      return;
    }
    
    if (this.resolverSeleccion) {
      this.resolverSeleccion(this.NgModelVariable.trim());
    }
    this.openModal = false;
    this.NgModelVariable = '';
  }
  
  esperarSeleccionUsuario(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.resolverSeleccion = resolve;
      this.rechazarSeleccion = reject;
    });
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
      // Ordenar por puntuación descendente
      coincidencias.sort((a, b) => b.puntuacion - a.puntuacion);
      
      const mejor = coincidencias[0];      
      // Si hay múltiples opciones similares, mostrar modal
      if (coincidencias.length > 1 && mejor.puntuacion < 100) {
        const opcionesArray = coincidencias.slice(0, 3).map(c => c.img.alt);
        this.opcionesTexto = opcionesArray.join('\n- ');
        this.NgModelVariable = '';
        this.openModal = true;

        try {
          const seleccion = await this.esperarSeleccionUsuario();
          
          // Permitir coincidencia flexible
          const encontrada = opcionesArray.find(opt =>
            opt.toLowerCase().trim() === seleccion.toLowerCase().trim()
          );
        
          if (!encontrada) {
            // Procesar de todas formas lo que el usuario escribió
            this.procesarImagenInfo(seleccion.trim());
          } else {
            this.procesarImagenInfo(encontrada);
          }
        } catch (error) {
          alert('Búsqueda cancelada. Intenta con un término más específico.');
        }
      }}}

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
    
    // Calcular distancia de Levenshtein
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