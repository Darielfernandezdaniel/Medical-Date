import { ChangeDetectorRef, Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CoverageService } from '../Services/coverage-service';
import { CommonModule } from '@angular/common';
import { ShowButton } from "../show-button/show-button";
import { ActivatedRoute } from '@angular/router';
import { BrowserStorageServices } from '../Services/browser-storage-services';


@Component({
  selector: 'app-section-info',
  imports: [CommonModule, ShowButton],
  templateUrl: './section-info.html',
  styleUrls: ['./section-info.css']
})
export class SectionInfo implements AfterViewInit {
  Seguros: { [seguro: string]: { imagen: string; coberturas: string[] } } = {};
 
  segurosOrdenados = [
    'Seguro Médico Básico',
    'Seguro Médico Pro',
    'Seguro Médico Ejecutivo',
    'Premium Ejecutivo'
  ];

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(
    private seguroService: CoverageService,  
    private route: ActivatedRoute,
    private storage: BrowserStorageServices
  ) {}

  ngOnInit(): void {
    this.Seguros = this.seguroService.getTodasLasCoberturasSeparadas();
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && this.scrollContainer?.nativeElement;
  }

  ngAfterViewInit(): void {
    const indexParam = this.route.snapshot.paramMap.get('index');
    const storedIndex = Number(this.storage.getSessionItem('lastSectionIndex') ?? 0);

    if (indexParam !== null) {
      const newIndex = Number(indexParam);

      // Si recarga o mismo índice, forzar scroll directo
      if (newIndex === storedIndex) {

        this.forceScrollToIndex(newIndex);
      } 
      // Scroll incremental hacia la derecha
      else if (newIndex > storedIndex) {
        const diff = newIndex - storedIndex;
  
        this.scrollRightWithDelay(diff, storedIndex);
      } 
      // Scroll incremental hacia la izquierda
      else {
        const diff = storedIndex - newIndex;

        this.scrollLeftWithDelay(diff, storedIndex);
      }

      // Guardar índice actual en sessionStorage seguro
      this.storage.setSessionItem('lastSectionIndex', String(newIndex));
    } else {
    }
  }

  private forceScrollToIndex(index: number) {
    if (this.isBrowser()) {
      const viewportWidth = window.innerWidth;
      this.scrollContainer.nativeElement.scrollLeft = viewportWidth * index;
    }
  }

  private async scrollRightWithDelay(times: number, startIndex: number) {
    for (let i = 0; i < times; i++) {
      this.scrollRight();
      await this.delay(400);
    }
    // Caso especial si llegamos al índice 3
    if (times + startIndex === 3) {
      this.scrollRight();
    }
  }

  private async scrollLeftWithDelay(times: number,  startIndex: number) {
    for (let i = 0; i < times; i++) {
      this.scrollLeft();
      await this.delay(400);
    }

    if (times - startIndex === 0) {
      this.scrollLeft();
    }
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  scrollLeft(): void {
    if (this.isBrowser()) {
      const viewportWidth = window.innerWidth;
      this.scrollContainer.nativeElement.scrollLeft -= viewportWidth;
    }
  }
  
  scrollRight(): void {
    if (this.isBrowser()) {
      const viewportWidth = window.innerWidth;
      this.scrollContainer.nativeElement.scrollLeft += viewportWidth;
    }
  }
}
