import { Component, ElementRef, ViewChild, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalTestInfo} from '../Interfaces/Insurances';
import { TestInfoService } from '../Services/test-info';
import { FormsModule } from '@angular/forms';
import { NavigationBarLeft } from "../navigation-bar-left/navigation-bar-left";
import { NavigationBarRight } from "../navigation-bar-right/navigation-bar-right";
import { RegisterForm } from "../register-form/register-form";
import { CheckingDataPatient } from '../Services/checking-data-patient';
import { Subject, take, takeUntil } from 'rxjs';
import { BrowserStorageServices } from '../Services/browser-storage-services';
import { ImgFromS3 } from '../Services/img-from-s3';
import { GetMedicatlTestIngo } from '../Services/get-medicatl-test-ingo';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-our-technologi',
  imports: [CommonModule, FormsModule, NavigationBarLeft, NavigationBarRight, RegisterForm, RouterLink],
  templateUrl: './our-technologi.html',
  styleUrls: ['./our-technologi.css'],
})
export class OurTechnologi{
  selectedInfo!: MedicalTestInfo // Cambio: ahora es un solo objeto, no array
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  opcionesDisponibles: MedicalTestInfo[] = []; // Nuevo: array para las opciones del modal
  opcionesTexto!: string; // Mantener esta variable para compatibilidad
  NgModelVariable: string = '';
  openModal: boolean = false;
  private resolverSeleccion!: (valor: string) => void;
  private rechazarSeleccion!: (razon?: any) => void;
  unicVar: boolean = false;
  fadeClass = 'fade-in';
  patientDataExist: Boolean = false;
  images: { url: string; id: string }[] = [];
  page = 1;
  limit = 7;
  total = 0;
  loading = false;

  constructor(
    private storage: BrowserStorageServices, 
    private imagesService: ImgFromS3, 
    private testInfoService: TestInfoService, 
    private cdr: ChangeDetectorRef, 
    private checkData: CheckingDataPatient,
    private getMedicalInfo: GetMedicatlTestIngo
  ) {}

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.loadImages();
    this.loadPatientData();
  }

  loadImages() {
    if (this.loading) return;
    this.loading = true;

    this.imagesService.getImages(this.page, this.limit).subscribe({
      next: (res) => {
        console.log(res)
        this.images = [...this.images, ...res.images];
        this.total = res.total;
        this.loading = false;
        this.page++;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  onScroll(event: any) {
    const container = event.target;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const threshold = 1000;

    const nearBottom = scrollTop + clientHeight >= scrollHeight - threshold;
    const nearRight = scrollLeft + clientWidth >= scrollWidth - threshold;

    if ((nearBottom || nearRight) && this.images.length < this.total) {
      this.loadImages();
      this.cdr.markForCheck();
    }
  }

  trackByFn(index: number, item: { url: string; id: string }) {
    return item.id;
  }

  private loadPatientData() {
    const email = this.storage.getLocalItem('email') || this.storage.getSessionItem('email');
    if (!email) return;

    this.checkData.confirmateDataPatient(email).pipe(take(1)).subscribe({
      next: (response) => {
        console.log(response);
        if (response.exists) {
          this.patientDataExist = false;
        } else {
          this.patientDataExist = true;
          this.cdr.markForCheck();
          this.subscribeToPatientDataResult();
        }
      }
    });
  }

  subscribeToPatientDataResult() {
    this.testInfoService.getPatientDataResult$()
    .pipe(takeUntil(this.destroy$))
    .subscribe(result => {      
      if (result && result.message === "Datos insertados correctamente") {

        this.patientDataExist = false;
        this.cdr.markForCheck()
      }
    });
  }

  cancelarSeleccion() {
    this.openModal = false;
    this.opcionesDisponibles = [];
    this.NgModelVariable = '';
    if (this.rechazarSeleccion) {
      this.rechazarSeleccion('cancelado');
    }
  }

  // Método corregido: ahora maneja el array de opciones de la Lambda
  procesarImagenInfo(ID: string) {
    this.getMedicalInfo.getInfoById(ID).pipe().subscribe({
      next: (opciones: MedicalTestInfo []) => {
        console.log(opciones)
        if (opciones && opciones.length > 0) {
          if (opciones.length === 1) {
            this.selectedInfo = opciones[0];
            this.unicVar = true;
          } else {
            // Si hay múltiples opciones, mostrar el modal
            this.opcionesDisponibles = opciones;
            this.openModal = true;
          }
          this.cdr.markForCheck();
        }
      },
      error: (error) => {
        console.error('Error al obtener información:', error);
      }
    });
  }

  // Método corregido: ahora recibe un objeto TestInfo completo
  selectedInfoFromModal(opcionSeleccionada: MedicalTestInfo) {
    this.openModal = false;
    this.selectedInfo = opcionSeleccionada;
    this.opcionesDisponibles = [];
    this.unicVar = true;
    this.cdr.markForCheck();
  }

  // Nuevo método para búsqueda por texto
  buscarPrueba(query: string) {
    if (!query.trim()) return;
    
    this.getMedicalInfo.getInfoById(query).pipe().subscribe({
      next: (opciones: MedicalTestInfo[]) => {
        if (opciones && opciones.length > 0) {
          if (opciones.length === 1) {
            this.selectedInfo = opciones[0];
            this.unicVar = true;
          } else {
            this.opcionesDisponibles = opciones; 
            this.openModal = true;
          }
          this.cdr.markForCheck();
        }
      },
      error: (error) => {
        console.error('Error en búsqueda:', error);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}