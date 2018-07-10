import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoArrayComponent } from './demo-array.component';

describe('DemoArrayComponent', () => {
  let component: DemoArrayComponent;
  let fixture: ComponentFixture<DemoArrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoArrayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
