import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Spinner } from '../Services/spinner';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-spin',
  imports: [CommonModule],
  templateUrl: './spinner.html',
  styleUrl: './spinner.css'
})
export class Spin {
  isLoading: Observable<boolean>;

  constructor(private spinnerService: Spinner) {
    this.isLoading = this.spinnerService.spinner$;
  }
}
