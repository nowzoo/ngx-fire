import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoSimpleComponent } from './demo-simple.component';

describe('DemoSimpleComponent', () => {
  let component: DemoSimpleComponent;
  let fixture: ComponentFixture<DemoSimpleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoSimpleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
