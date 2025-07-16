import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigaionBar } from './navigaion-bar';

describe('NavigaionBar', () => {
  let component: NavigaionBar;
  let fixture: ComponentFixture<NavigaionBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigaionBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigaionBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
