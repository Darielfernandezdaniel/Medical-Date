import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoverageService {
  // Pruebas específicas para cada seguro, solo las exclusivas a partir del básico
  pruebasPorSeguro = {
    'Seguro Médico Básico': {
      imagen: 'assets/First-Coverage.avif',
      coberturas: [
        'Consultas de medicina general',
        'Acceso ambulatorio',
        'Análisis de sangre',
        'Análisis de orina',
        'Radiografías simples',
        'Remisiones a especialistas',
        'Atención de urgencias',
        'Seguro dental básico',
        'Atención telefónica',
        '(30 €/mes)'
      ]
    },
  
    'Seguro Médico Pro': {
      imagen: 'assets/Second-Coverage.avif',
      coberturas: [
        'Todo lo asegurado previamente más:',
        'Hospitalización con habitación individual',
        'Intervenciones quirúrgicas programadas',
        'Fisioterapia y rehabilitación',
        'Psicología clínica',
        'Medicina preventiva (chequeos anuales)',
        '(70 €/mes)'
      ]
    },
  
    'Seguro Médico Ejecutivo': {
      imagen: 'assets/Third-Coverage.avif',
      coberturas: [
        'Todo lo asegurado previamente más:',
        'Telemedicina avanzada con especialistas de élite',
        'Cobertura en desplazamientos internacionales por trabajo',
        'Chequeo médico ejecutivo con resultados el mismo día',
        'Acceso a redes médicas internacionales sin copago',
        'Gestor personal de salud para seguimiento continuo',
        'Acompañamiento médico durante hospitalizaciones largas',
        '(100 €/mes)'
      ]
    },
  
    'Premium Ejecutivo': {
      imagen: 'assets/Last-Coverage.avif',
      coberturas: [
        'Todo lo asegurado previamente más:',
        'Reembolso 100% nacional/internacional',
        'Hospitales de élite (Mayo Clinic, Quirón, etc.)',
        'Atención VIP sin listas de espera',
        'Cobertura mundial permanente',
        'Médico personal asignado',
        '(200 €/mes)'
      ]
    }
  }

  // Define el orden jerárquico de los seguros
  private segurosOrdenados = [
    'Seguro Médico Básico',
    'Seguro Médico Pro',
    'Seguro Médico Ejecutivo',
    'Premium Ejecutivo'
  ];

  getTodasLasPruebas(nombreSeguro: string): string[] {
    const index = this.segurosOrdenados.indexOf(nombreSeguro);
    if (index === -1) return [];
  
    let acumulado: string[] = [];
    for (let i = 0; i <= index; i++) {
      const key = this.segurosOrdenados[i] as keyof typeof this.pruebasPorSeguro;
      acumulado = [...acumulado, ...this.pruebasPorSeguro[key].coberturas]; // Cambió acá, ahora accedes a .coberturas
    }
  
    return [...new Set(acumulado)];
  }
  
  // Solo las coberturas específicas, sin acumulación
  getPruebasEspecificas(nombreSeguro: string): string[] {
    return this.pruebasPorSeguro[nombreSeguro as keyof typeof this.pruebasPorSeguro]?.coberturas || [];
  }
  
  // Devuelve todas las coberturas (y ahora con imágenes) - Si quieres devolver todo junto para el html
  getTodasLasCoberturasSeparadas(): { [seguro: string]: { imagen: string, coberturas: string[] } } {
    return { ...this.pruebasPorSeguro };
  }
}
