import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTypeAheadComponent } from './report-type-ahead.component';

describe('ReportTypeAheadComponent', () => {
  let component: ReportTypeAheadComponent;
  let fixture: ComponentFixture<ReportTypeAheadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTypeAheadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportTypeAheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
