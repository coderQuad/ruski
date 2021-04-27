import { TestBed } from '@angular/core/testing';

import { FetchLeaderboardService } from './fetch-leaderboard.service';

describe('FetchLeaderboardService', () => {
  let service: FetchLeaderboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchLeaderboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
