import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivingWeighMasterCertificateComponent } from './receiving-weigh-master-certificate.component';

describe('ReceivingWeighMasterCertificateComponent', () => {
  let component: ReceivingWeighMasterCertificateComponent;
  let fixture: ComponentFixture<ReceivingWeighMasterCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivingWeighMasterCertificateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceivingWeighMasterCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
