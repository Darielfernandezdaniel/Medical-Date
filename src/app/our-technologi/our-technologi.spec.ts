import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurTechnologi } from './our-technologi';

describe('OurTechnologi', () => {
  let component: OurTechnologi;
  let fixture: ComponentFixture<OurTechnologi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurTechnologi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurTechnologi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
