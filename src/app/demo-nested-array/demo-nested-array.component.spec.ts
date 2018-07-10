import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoNestedArrayComponent } from './demo-nested-array.component';

describe('DemoNestedArrayComponent', () => {
  let component: DemoNestedArrayComponent;
  let fixture: ComponentFixture<DemoNestedArrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoNestedArrayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoNestedArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
