import { Component } from '@angular/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  imports: [ MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, CommonModule, FormsModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})

export class Calendar {

  fechaSeleccionada: Date | null = null;
  minDate: Date = new Date();

  onDateSelected(event: MatDatepickerInputEvent<Date>) {
    const fecha = event.value;
    console.log('Fecha seleccionada:', fecha);
    // Aquí puedes abrir un formulario de reserva o guardar la cita
  }

  onDateSelectedFromCalendar(fecha: Date) {
    this.fechaSeleccionada = fecha;
    this.onDateSelected({ value: fecha } as MatDatepickerInputEvent<Date>);
  }
}
