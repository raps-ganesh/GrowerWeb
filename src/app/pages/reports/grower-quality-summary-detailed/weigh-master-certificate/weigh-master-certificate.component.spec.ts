import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeighMasterCertificateComponent } from './weigh-master-certificate.component';

describe('WeighMasterCertificateComponent', () => {
  let component: WeighMasterCertificateComponent;
  let fixture: ComponentFixture<WeighMasterCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeighMasterCertificateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeighMasterCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
