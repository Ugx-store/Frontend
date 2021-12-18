import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetMessageComponent } from './password-reset-message.component';

describe('PasswordResetMessageComponent', () => {
  let component: PasswordResetMessageComponent;
  let fixture: ComponentFixture<PasswordResetMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordResetMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
