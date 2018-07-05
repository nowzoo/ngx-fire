import { NgxFireControlBinding } from './ngx-fire-control-binding';
import { NgxFireBinding } from './ngx-fire-binding';

import { fakeAsync, tick } from '@angular/core/testing';
import { NgxFireStatus } from './interfaces';
import { BehaviorSubject, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
describe('NgxFireControlBinding', () => {
  let control;
  let ref;
  let factory;
  beforeEach(() => {
    factory = {};
    ref = {
      on: jasmine.createSpy(),
      set: jasmine.createSpy().and.returnValue(Promise.resolve())
    };
    control = new FormControl(null);
  });
  it('should create an instance', () => {
    expect(new NgxFireControlBinding(factory, control, ref)).toBeTruthy();
  });
  it('should have a control property', () => {
    const b = new NgxFireControlBinding(factory, control, ref);
    expect(b.control).toBe(control);
  });

  describe('trim', () => {
    it('should be false if false has been passed in the constructor', () => {
      const b = new NgxFireControlBinding(factory, control, ref, {trim: false});
      expect(b.trim).toBe(false);
    });
    it('should be true if true has been passed in the constructor', () => {
      const b = new NgxFireControlBinding(factory, control, ref, {trim: true});
      expect(b.trim).toBe(true);
    });
    it('should be true if nothing has been passed in the constructor', () => {
      const b = new NgxFireControlBinding(factory, control, ref);
      expect(b.trim).toBe(true);
    });
  });
  describe('debounce', () => {
    it('should be 0 if 0 has been passed in the constructor', () => {
      const b = new NgxFireControlBinding(factory, control, ref, {debounce: 0});
      expect(b.debounce).toBe(0);
    });
    it('should be 0 if nothing has been passed in the constructor', () => {
      const b = new NgxFireControlBinding(factory, control, ref);
      expect(b.debounce).toBe(0);
    });
    it('should be 10 if "10" has been passed in the constructor', () => {
      const b = new NgxFireControlBinding(factory, control, ref, {debounce: '10' as any});
      expect(b.debounce).toBe(10);
    });
    it('should be 10 if 10 has been passed in the constructor', () => {
      const b = new NgxFireControlBinding(factory, control, ref, {debounce: 10});
      expect(b.debounce).toBe(10);
    });
    it('should be 0 if -10 has been passed in the constructor', () => {
      const b = new NgxFireControlBinding(factory, control, ref, {debounce: -10});
      expect(b.debounce).toBe(0);
    });

  });

  describe('save', () => {
    it('should set the status to CONTROL_INVALID if the control is invalid', () => {
      let status;
      const b = new NgxFireControlBinding(factory, control, ref);
      spyOnProperty(b, 'control').and.returnValue({value: 'foo', status: 'INVALID'});
      b.status.subscribe(v => status = v);
      b.save();
      expect(status).toBe(NgxFireStatus.CONTROL_INVALID);
    });
    it('should not call ref.set if the control is invalid', () => {
      const b = new NgxFireControlBinding(factory, control, ref);
      spyOnProperty(b, 'control').and.returnValue({value: 'foo', status: 'INVALID'});
      b.save();
      expect(ref.set).not.toHaveBeenCalled();
    });
    it('should set the status to SAVING', () => {
      let status;
      const b = new NgxFireControlBinding(factory, control, ref);
      spyOnProperty(b, 'control').and.returnValue({value: 'foo', status: 'VALID'});
      b.status.subscribe(v => status = v);
      b.save();
      expect(status).toBe(NgxFireStatus.SAVING);
    });
    it('should call ref.set', () => {
      const b = new NgxFireControlBinding(factory, control, ref);
      spyOnProperty(b, 'control').and.returnValue({value: 'foo', status: 'VALID'});
      b.save();
      expect(ref.set).toHaveBeenCalledWith('foo');
    });
    it('should call ref.set with the trimmed value if value is a string and trim is true', () => {
      const b = new NgxFireControlBinding(factory, control, ref);
      spyOnProperty(b, 'control').and.returnValue({value: '  foo   ', status: 'VALID'});
      spyOnProperty(b, 'trim').and.returnValue(true);
      b.save();
      expect(ref.set).toHaveBeenCalledWith('foo');
    });
    it('should call ref.set with the untrimmed value if value is a string and trim is false', () => {
      const b = new NgxFireControlBinding(factory, control, ref);
      spyOnProperty(b, 'control').and.returnValue({value: '  foo   ', status: 'VALID'});
      spyOnProperty(b, 'trim').and.returnValue(false);
      b.save();
      expect(ref.set).toHaveBeenCalledWith('  foo   ');
    });
    it('should call ref.set with the value if value is not a string and trim is true', () => {
      const b = new NgxFireControlBinding(factory, control, ref);
      spyOnProperty(b, 'control').and.returnValue({value: 8, status: 'VALID'});
      spyOnProperty(b, 'trim').and.returnValue(false);
      b.save();
      expect(ref.set).toHaveBeenCalledWith(8);
    });
    it('should set the status to saved after resolving', fakeAsync(() => {
      let status;
      const b = new NgxFireControlBinding(factory, control, ref);
      spyOnProperty(b, 'control').and.returnValue({value: 'foo', status: 'VALID'});
      b.status.subscribe(v => status = v);
      b.save();
      expect(status).toBe(NgxFireStatus.SAVING);
      tick();
      expect(status).toBe(NgxFireStatus.SAVED);
    }));
    it('should call onDbError on error', fakeAsync(() => {
      let status;
      let subErr;
      const b = new NgxFireControlBinding(factory, control, ref);
      spyOnProperty(b, 'control').and.returnValue({value: 'foo', status: 'VALID'});
      const error = new Error('bar');
      ref.set.and.returnValue(Promise.reject(error));
      b.status.subscribe(v => status = v);
      b.dbError.subscribe(v => subErr = v);
      b.save();
      expect(status).toBe(NgxFireStatus.SAVING);
      tick();
      expect(status).toBe(NgxFireStatus.DATABASE_ERROR);
      expect(subErr).toBe(error);
    }));
  });

  describe('init()', () => {
    let binding;
    beforeEach(() => {
      binding = new NgxFireControlBinding(factory, control, ref);
      spyOn(binding, 'save').and.callFake(() => {});
    });
    it('should subscribe to the valueChanges ', fakeAsync(() => {
      expect(binding.save).toHaveBeenCalledTimes(0);
      control.setValue('bsvsgcsg');
      tick();
      expect(binding.save).toHaveBeenCalledTimes(1);
      control.setValue('sgsfsgf');
      tick();
      expect(binding.save).toHaveBeenCalledTimes(2);
    }));
    it('should subscribe to the statusChanges ', fakeAsync(() => {
      expect(binding.save).toHaveBeenCalledTimes(0);
      control.setValue('bsvsgcsg');
      tick();
      expect(binding.save).toHaveBeenCalledTimes(1);
      control.setErrors({foo: true});
      tick();
      expect(binding.save).toHaveBeenCalledTimes(2);
    }));
  });

  describe('onDbValue(snap)', () => {
    let binding;
    let snap;
    let value;
    let superSpy;
    beforeEach(() => {
      value = 'foo';
      snap = {val: jasmine.createSpy().and.returnValue(value)};
      binding = new NgxFireControlBinding(factory, control, ref);
      superSpy = spyOn(NgxFireBinding.prototype, 'onDbValue').and.callFake(() => {});
      spyOn(control, 'setValue').and.callThrough();
    });
    it('should call super.onDbValue', () => {
      binding.onDbValue(snap);
      expect(superSpy).toHaveBeenCalledWith(snap);
    });
    it('should set the value of the control', () => {
      binding.onDbValue(snap);
      expect(control.setValue).toHaveBeenCalledWith(value, {emitEvent: false});
    });
  });
});
