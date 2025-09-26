import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionInfo } from './section-info';

describe('SectionInfo', () => {
  let component: SectionInfo;
  let fixture: ComponentFixture<SectionInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
