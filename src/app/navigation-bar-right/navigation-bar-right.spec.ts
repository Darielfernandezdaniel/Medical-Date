import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationBarRight } from './navigation-bar-right';

describe('NavigationBarRight', () => {
  let component: NavigationBarRight;
  let fixture: ComponentFixture<NavigationBarRight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationBarRight]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationBarRight);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
