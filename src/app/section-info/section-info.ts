import { Component } from '@angular/core';
import { CoverageService } from '../Services/coverage-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-info',
  imports: [CommonModule],
  templateUrl: './section-info.html',
  styleUrl: './section-info.css'
})
export class SectionInfo {
  Seguros: { [seguro: string]: { imagen: string; coberturas: string[] } } = {};

  segurosOrdenados = [
    'Seguro Médico Básico',
    'Seguro Médico Pro',
    'Seguro Médico Ejecutivo',
    'Premium Ejecutivo'
  ];

  constructor(private seguroService: CoverageService ) {}
  sectionInfo:string = "";

  ngOnInit(): void {
    this.Seguros = this.seguroService.getTodasLasCoberturasSeparadas();
  }

  showSectionInfo(arg0:string){
    this.sectionInfo = arg0;
  }
}