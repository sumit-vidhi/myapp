import { TestBed, inject } from '@angular/core/testing';

import { MealserviceService } from './mealservice.service';

describe('MealserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MealserviceService]
    });
  });

  it('should be created', inject([MealserviceService], (service: MealserviceService) => {
    expect(service).toBeTruthy();
  }));
});
