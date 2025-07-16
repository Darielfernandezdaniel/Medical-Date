// medical-insurance.component.ts
import { CommonModule } from '@angular/common';
import { Component, AfterViewInit} from '@angular/core';

@Component({
  selector: 'app-medical-insurance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medical-insurance.html',
  styleUrls: ['./medical-insurance.css']
})
export class MedicalInsurance implements AfterViewInit {
   currentIndex = 0;
  autoSlideInterval: any;

  ngAfterViewInit(): void {
    const carousel = document.getElementById('carousel');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');

    const goToSlide = (index: number) => {
      slides.forEach((slide, i) => {
        slide.classList.remove('active', 'prev', 'next');
        if (i === index) {
          slide.classList.add('active');
        } else if (i === (index + 1) % slides.length) {
          slide.classList.add('next');
        } else if (i === (index - 1 + slides.length) % slides.length) {
          slide.classList.add('prev');
        } else {
          slide.classList.add('next');
        }
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });

      this.currentIndex = index;
    };

    const startAutoSlide = () => {
      this.autoSlideInterval = setInterval(() => {
        goToSlide((this.currentIndex + 1) % slides.length);
      }, 5000);
    };

    const stopAutoSlide = () => {
      clearInterval(this.autoSlideInterval);
    };

    prevBtn?.addEventListener('click', () => {
      stopAutoSlide();
      goToSlide((this.currentIndex - 1 + slides.length) % slides.length);
      startAutoSlide();
    });

    nextBtn?.addEventListener('click', () => {
      stopAutoSlide();
      goToSlide((this.currentIndex + 1) % slides.length);
      startAutoSlide();
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        stopAutoSlide();
        goToSlide(index);
        startAutoSlide();
      });
    });

    thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', () => {
        stopAutoSlide();
        goToSlide(index);
        startAutoSlide();
      });
    });

    carousel?.addEventListener('mouseenter', stopAutoSlide);
    carousel?.addEventListener('mouseleave', startAutoSlide);

    startAutoSlide();
  }
}