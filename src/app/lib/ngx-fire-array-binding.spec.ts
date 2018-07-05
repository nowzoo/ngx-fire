import { NgxFireArrayBinding } from './ngx-fire-array-binding';
import { FormArray } from '@angular/forms';
describe('NgxFireArrayBinding', () => {
  let control;
  let ref;
  let factory;
  beforeEach(() => {
    factory = {};
    ref = {
      on: jasmine.createSpy(),
      set: jasmine.createSpy().and.returnValue(Promise.resolve())
    };
    control = new FormArray([]);
  });
  it('should create an instance', () => {
    expect(new NgxFireArrayBinding(factory, control, ref)).toBeTruthy();
  });
});
