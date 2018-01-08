import { TestBed, inject } from '@angular/core/testing';

import { SessionInformationService } from './session-information.service';

describe('SessionInformationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionInformationService]
    });
  });

  it('should be created', inject([SessionInformationService], (service: SessionInformationService) => {
    expect(service).toBeTruthy();
  }));
});
