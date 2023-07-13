import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCalculationReportComponent } from './payment-calculation-report.component';

describe('PaymentCalculationReportComponent', () => {
  let component: PaymentCalculationReportComponent;
  let fixture: ComponentFixture<PaymentCalculationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentCalculationReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentCalculationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
