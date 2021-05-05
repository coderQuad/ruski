import { TestBed } from '@angular/core/testing';

import { SearchFetcherService } from './search-fetcher.service';

describe('SearchFetcherService', () => {
  let service: SearchFetcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchFetcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
