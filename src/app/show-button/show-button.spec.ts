import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowButton } from './show-button';

describe('ShowButton', () => {
  let component: ShowButton;
  let fixture: ComponentFixture<ShowButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
