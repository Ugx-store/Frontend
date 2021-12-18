import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetInputComponent } from './password-reset-input.component';

describe('PasswordResetInputComponent', () => {
  let component: PasswordResetInputComponent;
  let fixture: ComponentFixture<PasswordResetInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordResetInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
