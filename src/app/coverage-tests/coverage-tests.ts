import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-coverage-tests',
  imports: [CommonModule],
  templateUrl: './coverage-tests.html',
  styleUrl: './coverage-tests.css'
})
export class CoverageTests {
  pruebasBasico = [
    'Consultas de medicina general',
    'Acceso ambulatorio',
    'Análisis de sangre',
    'Análisis de orina',
    'Radiografías simples',
    'Remisiones a especialistas',
    'Atención de urgencias'
  ];
  
  pruebasPro = [
    ...this.pruebasBasico,
    'Hospitalización con habitación individual',
    'Intervenciones quirúrgicas programadas',
    'Fisioterapia y rehabilitación',
    'Psicología clínica',
    'Medicina preventiva (chequeos anuales)'
  ];
  
  pruebasEjecutivo = [
    ...this.pruebasPro,
    'Segunda opinión médica internacional'
  ];
  
  pruebasPremium = [
    ...this.pruebasEjecutivo,
    'Reembolso 100% nacional/internacional',
    'Hospitales de élite',
    'Chequeos médicos ejecutivos',
    'Atención VIP sin listas de espera',
    'Cobertura mundial permanente',
    'Médico personal asignado'
  ];
}
