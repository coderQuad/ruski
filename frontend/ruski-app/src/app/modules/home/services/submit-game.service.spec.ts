import { TestBed } from '@angular/core/testing';

import { SubmitGameService } from './submit-game.service';

describe('SubmitGameService', () => {
    let service: SubmitGameService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SubmitGameService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
