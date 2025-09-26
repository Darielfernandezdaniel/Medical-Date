import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataForm } from './data-form';

describe('DataForm', () => {
  let component: DataForm;
  let fixture: ComponentFixture<DataForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
