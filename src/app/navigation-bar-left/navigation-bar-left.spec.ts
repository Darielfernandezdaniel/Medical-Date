import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationBarLeft } from './navigation-bar-left';

describe('NavigationBarLeft', () => {
  let component: NavigationBarLeft;
  let fixture: ComponentFixture<NavigationBarLeft>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationBarLeft]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationBarLeft);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
