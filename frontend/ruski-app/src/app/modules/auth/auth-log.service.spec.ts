import { TestBed } from '@angular/core/testing';

import { AuthLogService } from './auth-log.service';

describe('AuthLogService', () => {
    let service: AuthLogService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AuthLogService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
