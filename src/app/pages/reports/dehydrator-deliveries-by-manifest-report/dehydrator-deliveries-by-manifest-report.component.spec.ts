import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DehydratorDeliveriesByManifestReportComponent } from './dehydrator-deliveries-by-manifest-report.component';

describe('DehydratorDeliveriesByManifestReportComponent', () => {
  let component: DehydratorDeliveriesByManifestReportComponent;
  let fixture: ComponentFixture<DehydratorDeliveriesByManifestReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DehydratorDeliveriesByManifestReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DehydratorDeliveriesByManifestReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
