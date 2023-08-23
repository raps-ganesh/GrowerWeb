import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowerQualitySummaryDetailedComponent } from './grower-quality-summary-detailed.component';

describe('GrowerQualitySummaryDetailedComponent', () => {
  let component: GrowerQualitySummaryDetailedComponent;
  let fixture: ComponentFixture<GrowerQualitySummaryDetailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrowerQualitySummaryDetailedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrowerQualitySummaryDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
