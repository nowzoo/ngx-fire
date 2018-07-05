import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxFireComponent } from './ngx-fire.component';

describe('NgxFireComponent', () => {
  let component: NgxFireComponent;
  let fixture: ComponentFixture<NgxFireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxFireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxFireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});