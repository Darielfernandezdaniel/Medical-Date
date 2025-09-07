import { Component} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { TestInfoService } from '../../Services/test-info';
import { onlyNumbersValidator } from '../../Custom-Validators/onlyNumbersValidator';
import { onlyLettersValidator } from '../../Custom-Validators/onlyLettersValidator';
import { BrowserStorageServices } from '../../Services/browser-storage-services';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.html',
  styleUrls: ['./data-form.css'],
  imports: [ReactiveFormsModule]
})
export class DataForm {
  dataForm: FormGroup;
  isLoading = false;
  illnessList: string[] = [];
  familyIllnessList: string[] = [];
  medicationList: string[] = [];
  dataPatient: boolean = true;
  email: string | null = null;

  constructor(private fb: FormBuilder, private testInfoService: TestInfoService, private storage: BrowserStorageServices) {
    this.dataForm = this.fb.group({
      name: this.fb.control('', [Validators.required, onlyLettersValidator()]),
      Apellido: this.fb.control('', [Validators.required, onlyLettersValidator()]),
      edad: this.fb.control('', [Validators.required, onlyNumbersValidator()]),
      sexo: this.fb.control('', [Validators.required]),
      PermanentMedication: this.fb.control('', [Validators.pattern(/^[a-zA-Z0-9,\s]*$/)]),
      illness: this.fb.control('', [Validators.pattern(/^[a-zA-Z0-9,\s]*$/)]),
      familyIllness: this.fb.control('', [Validators.pattern(/^[a-zA-Z0-9,\s]*$/)])
    })
  }

  ngOnInit(){
    this.email = this.storage.getLocalItem('email') || this.storage.getSessionItem('email')
  }

  onInputMaxLength(event: Event, max: number) {
    const input = event.target as HTMLInputElement;
    if (input.value.length > max) {
      input.value = input.value.slice(0, max);
      this.dataForm.get('edad')?.setValue(input.value);
    }
  }

  onSubmit() {
    if (this.dataForm.invalid) return;
    this.isLoading = true;
    console.log(this.email)
    const personalData = {
      name: this.dataForm.get('name')?.value,
      apellido: this.dataForm.get('Apellido')?.value,
      edad: this.dataForm.get('edad')?.value,
      sexo: this.dataForm.get('sexo')?.value,
      illness: this.illnessList,          
      familyIllness: this.familyIllnessList, 
      medication: this.medicationList,
      email: this.email
    };

    this.testInfoService.sendPatientData(personalData)
    .subscribe({
      next: (response) => {
        console.log('Datos enviados correctamente:', response);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al enviar datos:', error);
        this.isLoading = false;
      }
    });
}

  onIllnessKeyUp(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    if (event.key === ',' && value) {
      this.illnessList.push(value.replace(',', ''));
      input.value = '';
    }
  }
  removeIllness(index: number) {
    this.illnessList.splice(index, 1);
  }

  onFamilyIllnessKeyUp(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    if (event.key === ',' && value) {
      this.familyIllnessList.push(value.replace(',', ''));
      input.value = '';
    }
  }

  removeFamilyIllness(index: number) {
    this.familyIllnessList.splice(index, 1);
  }

  onMedicationKeyUp(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    if (event.key === ',' && value) {
      this.medicationList.push(value.replace(',', ''));
      input.value = '';
    }
  }
  removeMedication(index: number) {
    this.medicationList.splice(index, 1);
  }
}

