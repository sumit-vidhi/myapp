import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MealsdetailComponent } from './mealsdetail.component';

describe('MealsdetailComponent', () => {
  let component: MealsdetailComponent;
  let fixture: ComponentFixture<MealsdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MealsdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MealsdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
