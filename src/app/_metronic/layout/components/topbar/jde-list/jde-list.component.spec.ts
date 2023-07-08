import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JdeListComponent } from './jde-list.component';

describe('JdeListComponent', () => {
  let component: JdeListComponent;
  let fixture: ComponentFixture<JdeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JdeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JdeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
