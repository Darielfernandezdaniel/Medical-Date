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
import { Spin } from "../spinner/spinner";
import { Spinner } from '../Services/spinner';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-our-technologi',
  imports: [CommonModule, FormsModule, NavigationBarLeft, NavigationBarRight, RegisterForm, Spin, RouterLink],
  templateUrl: './our-technologi.html',
  styleUrls: ['./our-technologi.css'],
  providers: [CheckingDataPatient, TestInfoService]
})
export class OurTechnologi{
  selectedInfo!: MedicalTestInfo 
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  opcionesDisponibles: MedicalTestInfo[] = []; 
  opcionesTexto!: string; 
  NgModelVariable: string = '';
  openModal: boolean = false;
  private rechazarSeleccion!: (razon?: any) => void;
  unicVar: boolean = false;
  fadeClass = 'fade-in';
  patientDataExist: Boolean = false;
  
  //*Pagination*//
  images: { url: string; id: string }[] = [];
  page = 1;
  limit = 7;
  total = 0;
  loading = false;
  private preloaded: boolean = false;

  constructor(
    private storage: BrowserStorageServices, 
    private imagesService: ImgFromS3, 
    private testInfoService: TestInfoService, 
    private cdr: ChangeDetectorRef, 
    private checkData: CheckingDataPatient,
    private getMedicalInfo: GetMedicatlTestIngo,
    private spin:Spinner,
    private route: Router
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
  
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const threshold = 1000; // margen de activación
  
    const nearRight = scrollLeft + clientWidth >= scrollWidth - threshold;
  
    if (nearRight && this.images.length < this.total) {
      this.loadImages();
      this.cdr.markForCheck();
    }
  }

  trackByFn(index: number, item: { url: string; id: string }) {
    return item.id;
  }

  private loadPatientData() {
    const email = this.storage.getLocalItem('email') || this.storage.getSessionItem('email');
    console.log (email)
    if (!email) return;

    this.checkData.confirmateDataPatient(email).pipe(take(1)).subscribe({
      next: (response) => {
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

  procesarImagenInfo(ID: string) {
    if (!this.preloaded) {
      this.preloaded = true;  // Marca que ya se ejecutó
      this.unicVar = true;
      this.spin.show();
  }
      this.getMedicalInfo.getInfoById(ID).pipe().subscribe({
        next: (opciones: MedicalTestInfo[]) => {
          if (opciones && opciones.length > 0) {
            if (opciones.length === 1) {
              this.selectedInfo = opciones[0];
            } else {
              this.opcionesDisponibles = opciones;
              this.openModal = true;
            }
          }
          this.spin.hide();
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error al obtener información:', error);
          this.spin.hide();
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
    this.unicVar = true;
    this.spin.show();
    this.cdr.markForCheck();
    
    this.getMedicalInfo.getInfoById(query).pipe().subscribe({
      next: (opciones: MedicalTestInfo[]) => {
          this.spin.hide();
          this.cdr.markForCheck();
        if (opciones && opciones.length > 0) {
          if (opciones.length === 1) {
            this.selectedInfo = opciones[0];
            
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

  StripePay(){
    this.spin.show()
    this.route.navigate([`stripe/${this.selectedInfo.titulo}`]);
}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}