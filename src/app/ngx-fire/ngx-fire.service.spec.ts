import { TestBed, inject } from '@angular/core/testing';

import { NgxFireService } from './ngx-fire.service';

describe('NgxFireService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxFireService]
    });
  });

  it('should be created', inject([NgxFireService], (service: NgxFireService) => {
    expect(service).toBeTruthy();
  }));
});
