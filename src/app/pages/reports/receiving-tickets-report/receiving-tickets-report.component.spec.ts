import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingTicketsReportComponent } from './receiving-tickets-report.component';

describe('ReceivingTicketsReportComponent', () => {
  let component: ReceivingTicketsReportComponent;
  let fixture: ComponentFixture<ReceivingTicketsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivingTicketsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceivingTicketsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
