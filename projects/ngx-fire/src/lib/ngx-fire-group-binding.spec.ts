import { NgxFireGroupBinding } from './ngx-fire-group-binding';
import { FormGroup } from '@angular/forms';
describe('NgxFireGroupBinding', () => {
  let control;
  let ref;
  let factory;
  beforeEach(() => {
    factory = {};
    ref = {
      on: jasmine.createSpy(),
      set: jasmine.createSpy().and.returnValue(Promise.resolve())
    };
    control = new FormGroup({});
  });
  it('should create an instance', () => {
    expect(new NgxFireGroupBinding(factory, control, ref)).toBeTruthy();
  });
});
