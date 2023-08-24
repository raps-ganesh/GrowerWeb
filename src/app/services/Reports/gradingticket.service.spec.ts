import { TestBed } from '@angular/core/testing';

import { GradingticketService } from './gradingticket.service';

describe('GradingticketService', () => {
  let service: GradingticketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GradingticketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
