import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-medical-insurance',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './medical-insurance.html',
  styleUrls: ['./medical-insurance.css']
})
export class MedicalInsuranceComponent implements OnInit, OnDestroy {
  @ViewChild('carousel', { static: true }) carousel!: ElementRef;
  animationDirection: 'left' | 'right' = 'right';
  
  currentSlide = 0;
  totalSlides = 4;
  autoSlideInterval: any;
  
  slides = [
    { bgClass: 'bg-blue', title: 'Basic Coverage for Medical and Labo Assistance', description: 'Medical Insurance for Standard Issues', percentage: '25%', progressClass: 'Progresion-Bar1', textClass: '' },
    { bgClass: 'bg-green', title: 'Radiological and Labo Testing Coverage', description: 'Insurance to improve the analytic area and permanent healthy Issues', percentage: '50%', progressClass: 'Progresion-Bar2', textClass: 'item2' },
    { bgClass: 'bg-purple', title: 'Minor surgeries and high-cost tests.', description: 'Minor and Middle complexity surgeries and high cost test', percentage: '75%', progressClass: 'Progresion-Bar3', textClass: 'item3' },
    { bgClass: 'bg-yellow', title: 'Full Healthy Insurance', description: 'Covering the most complex issues with all surgeries and test available', percentage: '100%', progressClass: 'Progresion-Bar4', textClass: 'item4' }
  ];

  thumbnailIcons = ['', '', '', ''];

  constructor(private cdr: ChangeDetectorRef, private router: Router) {}   

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }
  
  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.cdr.detectChanges();   // 👈 fuerza actualización
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.cdr.detectChanges();   // 👈 fuerza actualización
  }

  goToSlide(index: number) {
    this.animationDirection = index > this.currentSlide ? 'right' : 'left';
    this.currentSlide = index;
    this.stopAutoSlide();
    this.startAutoSlide();
    this.cdr.detectChanges();   // 👈 fuerza actualización
  }

  onPrevClick() {
    this.stopAutoSlide();
    this.animationDirection = 'left';
    this.prevSlide();
    this.startAutoSlide();
    this.cdr.detectChanges();   // 👈 fuerza actualización
  }

  onNextClick() {
    this.stopAutoSlide();
    this.animationDirection = 'right';
    this.nextSlide();
    this.startAutoSlide();
    this.cdr.detectChanges();   // 👈 fuerza actualización
  }

  onThumbnailClick(index: number) {
    this.goToSlide(index);
  }

  onDotClick(index: number) {
    this.goToSlide(index);
  }
}
