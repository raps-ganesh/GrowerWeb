import { TestBed } from '@angular/core/testing';

import { GrowerPortalService } from './grower-portal.service';

describe('GrowerPortalService', () => {
  let service: GrowerPortalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrowerPortalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
