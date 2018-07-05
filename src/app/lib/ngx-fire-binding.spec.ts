import { NgxFireBinding } from './ngx-fire-binding';
import { NgxFireStatus } from './interfaces';
import { Subject } from 'rxjs';
class NgxFireBindingImpl extends NgxFireBinding {
  init() {}
}
describe('NgxFireBinding', () => {
  let control;
  let ref;
  let factory;
  let dbListener;
  beforeEach(() => {
    dbListener = {};
    factory = {};
    ref = {on: jasmine.createSpy().and.returnValue(dbListener), off: jasmine.createSpy()};
    control = {};
  });
  it('should create an instance', () => {
    expect(new NgxFireBindingImpl(factory, control, ref)).toBeTruthy();
  });

  it('should have a factory property', () => {
    const b = new NgxFireBindingImpl(factory, control, ref);
    expect(b.factory).toBe(factory);
  });
  it('should have a control property', () => {
    const b = new NgxFireBindingImpl(factory, control, ref);
    expect(b.control).toBe(control);
  });
  it('should have a ref property', () => {
    const b = new NgxFireBindingImpl(factory, control, ref);
    expect(b.ref).toBe(ref);
  });
  it('should have a status property', () => {
    const b = new NgxFireBindingImpl(factory, control, ref);
    expect(b.status.subscribe).toBeTruthy();
  });
  it('should have a dbError property', () => {
    const b = new NgxFireBindingImpl(factory, control, ref);
    expect(b.dbError.subscribe).toBeTruthy();
  });
  it('should have a dbValue property', () => {
    const b = new NgxFireBindingImpl(factory, control, ref);
    expect(b.dbValue.subscribe).toBeTruthy();
  });
  describe('destroy()', () => {
    let b: any;
    let sub: Subject<any>;

    beforeEach(() => {
      b = new NgxFireBindingImpl(factory, control, ref);
    });
    it('should call ref.off', () => {
      b.destroy();
      expect(ref.off).toHaveBeenCalledWith('value', dbListener);
    });
    it('should complete ngUnsubscribe', () => {
      let completed;
      sub = b.ngUnsubscribe.subscribe(() => completed = true);
      b.destroy();
      expect(completed).toBe(true);
    });
    it('should call destroy on all the children', () => {
      const b1 = {destroy: jasmine.createSpy()};
      const b2 = {destroy: jasmine.createSpy()};
      b.childBindings.set('foo', b1);
      b.childBindings.set('bar', b2);
      b.destroy();
      expect(b1.destroy).toHaveBeenCalledWith();
      expect(b2.destroy).toHaveBeenCalledWith();
    });
  });

  describe('onDbValue', () => {
    let snap;
    let value;
    let binding;

    beforeEach(() => {
      binding = new NgxFireBindingImpl(factory, control, ref);
      value = 'foo';
      snap = {val: jasmine.createSpy().and.returnValue(value)};
    });
    it('should call dbValue$.next with the value', () => {
      let actualValue;
      binding.dbValue.subscribe(val => actualValue = val);
      binding.onDbValue(snap);
      expect(snap.val).toHaveBeenCalledWith();
      expect(actualValue).toBe(value);
    });
    it('should call status$.next with SYNCED', () => {
      let status;
      binding.status.subscribe(val => status = val);
      binding.onDbValue(snap);
      expect(status).toBe(NgxFireStatus.SYNCED);
    });
  });
  describe('onDbError', () => {
    let error;
    let binding;

    beforeEach(() => {
      binding = new NgxFireBindingImpl(factory, control, ref);
      error = new Error('foo');
    });
    it('should call dbError$.next with the err', () => {
      let err;
      binding.dbError.subscribe(val => err = val);
      binding.onDbError(error);
      expect(err).toBe(error);
    });
    it('should call status$.next with DATABASE_ERROR', () => {
      let status;
      binding.status.subscribe(val => status = val);
      binding.onDbError(error);
      expect(status).toBe(NgxFireStatus.DATABASE_ERROR);
    });
    it('should call dbValue$.next with null', () => {
      let actualValue;
      binding.dbValue.subscribe(val => actualValue = val);
      binding.onDbError(error);
      expect(actualValue).toBe(null);
    });
  });
});
