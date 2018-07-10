import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoControlComponent } from './demo-control.component';

describe('DemoControlComponent', () => {
  let component: DemoControlComponent;
  let fixture: ComponentFixture<DemoControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
