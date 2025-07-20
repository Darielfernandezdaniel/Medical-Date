import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetUs } from './meet-us';

describe('MeetUs', () => {
  let component: MeetUs;
  let fixture: ComponentFixture<MeetUs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetUs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetUs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
