import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { TestInfoService } from '../../Services/test-info';
import { onlyNumbersValidator } from '../../Custom-Validators/onlyNumbersValidator';
import { onlyLettersValidator } from '../../Custom-Validators/onlyLettersValidator';

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

  constructor(private fb: FormBuilder, private testInfoService: TestInfoService) {
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
    const personalData = {
      name: this.dataForm.get('name')?.value,
      apellido: this.dataForm.get('Apellido')?.value,
      edad: this.dataForm.get('edad')?.value,
      sexo: this.dataForm.get('sexo')?.value,
      medications: this.dataForm.get('PermanentMedication')?.value.split(',').map((v: string) => v.trim()).filter((v: string) => v),
      familyIllnesses: this.dataForm.get('familyIllness')?.value.split(',').map((v: string) => v.trim()).filter((v: string) => v),
      illnesses: this.dataForm.get('illness')?.value.split(',').map((v: string) => v.trim()).filter((v: string) => v)
    };
  
    this.testInfoService.sendPatientData(personalData)
    .subscribe({
      next: (response: any) => {
        const body = JSON.parse(response.body); // parsea el body que viene de Lambda
        console.log('Éxito:', body.message, 'Patient ID:', body.patientId);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al enviar datos:', err);
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

