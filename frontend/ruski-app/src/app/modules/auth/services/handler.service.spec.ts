import { TestBed } from '@angular/core/testing';

import { HandlerService } from './handler.service';

describe('HandlerService', () => {
  let service: HandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
