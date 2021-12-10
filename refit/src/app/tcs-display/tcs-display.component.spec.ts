import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TcsDisplayComponent } from './tcs-display.component';

describe('TcsDisplayComponent', () => {
  let component: TcsDisplayComponent;
  let fixture: ComponentFixture<TcsDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TcsDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TcsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
