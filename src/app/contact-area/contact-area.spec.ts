import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactArea } from './contact-area';

describe('ContactArea', () => {
  let component: ContactArea;
  let fixture: ComponentFixture<ContactArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactArea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactArea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
