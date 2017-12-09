import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVarificationComponent } from './email-varification.component';

describe('EmailVarificationComponent', () => {
  let component: EmailVarificationComponent;
  let fixture: ComponentFixture<EmailVarificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailVarificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailVarificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
