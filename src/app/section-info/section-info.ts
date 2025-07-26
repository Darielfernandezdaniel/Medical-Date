import { Component } from '@angular/core';
import { CoverageService } from '../Services/coverage-service';
import { CommonModule } from '@angular/common';
import { ShowButton } from "../show-button/show-button";

@Component({
  selector: 'app-section-info',
  imports: [CommonModule, ShowButton],
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

  constructor(private seguroService: CoverageService) {}

  ngOnInit(): void {
    this.Seguros = this.seguroService.getTodasLasCoberturasSeparadas();
  }
}
