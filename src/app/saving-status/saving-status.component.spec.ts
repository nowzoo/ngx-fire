import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingStatusComponent } from './saving-status.component';

describe('SavingStatusComponent', () => {
  let component: SavingStatusComponent;
  let fixture: ComponentFixture<SavingStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavingStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
