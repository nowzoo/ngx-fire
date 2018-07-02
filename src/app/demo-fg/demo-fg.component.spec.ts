import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoFgComponent } from './demo-fg.component';

describe('DemoFgComponent', () => {
  let component: DemoFgComponent;
  let fixture: ComponentFixture<DemoFgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoFgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoFgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
