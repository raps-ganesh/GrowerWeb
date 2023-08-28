import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DehydratorDeliveryByGrowerAccountComponent } from './dehydrator-delivery-by-grower-account.component';

describe('DehydratorDeliveryByGrowerAccountComponent', () => {
  let component: DehydratorDeliveryByGrowerAccountComponent;
  let fixture: ComponentFixture<DehydratorDeliveryByGrowerAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DehydratorDeliveryByGrowerAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DehydratorDeliveryByGrowerAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
