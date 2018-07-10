import { NgxFireControlDirective } from './control.directive';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NgZone } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Reference } from '@firebase/database';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
describe('NgxFireControlDirective', () => {
  let ref;
  let dbListener;
  let formControl;
  let formDirective: any;
  let ngZone;
  let directive: NgxFireControlDirective;
  let directiveValue;
  let directiveError;
  let directiveSaving;
  let ngUnsubscribe: Subject<void>;


  afterEach(() => {
    ngUnsubscribe.next();
    ngUnsubscribe.complete();
  });
  beforeEach(async(() => {
    ngUnsubscribe = new Subject<void>();
    dbListener = {};

    ref = {
      set: jasmine.createSpy().and.returnValue(Promise.resolve()),
      on: jasmine.createSpy().and.returnValue(dbListener),
      off: jasmine.createSpy(),
    };
    formControl = new FormControl(null, {validators: [Validators.required]});
    formDirective = {control: formControl};
    ngZone = TestBed.get(NgZone);
    directive = new NgxFireControlDirective(formDirective, null, ngZone);
    directive.ngxFireControl = ref;
    directive.value.pipe(takeUntil(ngUnsubscribe)).subscribe(val => directiveValue = val);
    directive.error.pipe(takeUntil(ngUnsubscribe)).subscribe(val => directiveError = val);
    directive.saving.pipe(takeUntil(ngUnsubscribe)).subscribe(val => directiveSaving = val);
  }));

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set ref', () => {
      directive.ngOnInit();
      expect(directive.ref).toBe(ref);
    });
    it('should set value', () => {
      directive.ngOnInit();
      expect(directiveValue).toBe(null);
    });
    it('should set error', () => {
      directive.ngOnInit();
      expect(directiveError).toBe(null);
    });
    it('should set saving', () => {
      directive.ngOnInit();
      expect(directiveSaving).toBe(false);
    });

    it('should listen to db', () => {
      directive.ngOnInit();
      expect(ref.on).toHaveBeenCalledWith('value', jasmine.any(Function), jasmine.any(Function), directive);
    });

    it('should throw if there is no ref', () => {
      directive.ngxFireControl = null;
      expect(() => {
        directive.ngOnInit();
      }).toThrow();
    });
    it('should throw if there is no form directive', () => {
      expect(() => {
        directive = new NgxFireControlDirective(null, null, ngZone);
        directive.ngxFireControl = ref;
        directive.ngOnInit();
      }).toThrow();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unlisten to db', () => {
      directive.ngOnInit();
      directive.ngOnDestroy();
      expect(ref.off).toHaveBeenCalledWith('value', dbListener);
    });
    it('should stop listening to the form', fakeAsync(() => {
      spyOn(directive, 'save').and.returnValue(null);
      directive.ngOnInit();
      formControl.setValue('jsjhfshg');
      tick();
      expect(directive.save).toHaveBeenCalledTimes(1);
      directive.ngOnDestroy();
      formControl.setValue('jsjhjhdhdkhdkugfshg');
      tick();
      expect(directive.save).toHaveBeenCalledTimes(1);
    }));
  });

  describe('save', () => {
    it('should not save if the form is invalid', fakeAsync(() => {
      directive.ngOnInit();
      formControl.setValue('');
      expect(formControl.valid).toBe(false);
      directive.save();
      tick();
      expect(ref.set).not.toHaveBeenCalled();
    }));
    it('should not save if the form is pristine', fakeAsync(() => {
      directive.ngOnInit();
      formControl.setValue('ccc');
      expect(formControl.valid).toBe(true);
      expect(formControl.pristine).toBe(true);
      directive.save();
      tick();
      expect(ref.set).not.toHaveBeenCalled();
    }));
    it('should save if the form is valid & not pristine', fakeAsync(() => {
      directive.ngOnInit();
      formControl.setValue('ccc');
      formControl.markAsDirty();
      expect(formControl.valid).toBe(true);
      expect(formControl.pristine).toBe(false);
      directive.save();
      expect(directiveSaving).toBe(true);
      tick();
      expect(directiveSaving).toBe(false);
      expect(ref.set).toHaveBeenCalledWith('ccc');
    }));
    it('should handle db error', fakeAsync(() => {
      const e = new Error('foo');
      ref.set.and.callFake(() => Promise.reject(e));
      formControl.setValue('ccc');
      formControl.markAsDirty();
      directive.ngOnInit();
      directive.save();
      expect(directiveSaving).toBe(true);
      tick();
      expect(directiveSaving).toBe(false);
      expect(ref.set).toHaveBeenCalledWith('ccc');

    }));

    it('should trim string values if trim is true', () => {
      spyOn(directive, '_getTrim').and.returnValue(true);
      formControl.setValue('ccc    ');
      formControl.markAsDirty();
      directive.ngOnInit();
      directive.save();
      expect(ref.set).toHaveBeenCalledWith('ccc');
    });
    it('should be ok if trim is true but the val is not string', () => {
      spyOn(directive, '_getTrim').and.returnValue(true);
      formControl.setValue({});
      formControl.markAsDirty();
      directive.ngOnInit();
      directive.save();
      expect(ref.set).toHaveBeenCalledWith({});
    });
    it('should not trim string values if trim is false', () => {
      spyOn(directive, '_getTrim').and.returnValue(false);
      formControl.setValue('ccc    ');
      formControl.markAsDirty();
      directive.ngOnInit();
      directive.save();
      expect(ref.set).toHaveBeenCalledWith('ccc    ');
    });
  });

  describe('_onDbValue(snap)', () => {
    let snap;
    beforeEach(() => {
      snap = {val: () => 'foo'};
    });
    it('should set the value of the control and update the value obs', () => {
      directive.ngOnInit();
      directive._onDbValue(snap);
      expect(formControl.value).toBe('foo');
      expect(directiveValue).toBe('foo');
    });
  });

  describe('_getTrim()', () => {
    it('should be false if that is set in input', () => {
      directive.trim = false;
      expect(directive._getTrim()).toBe(false);
    });
    it('should be true if that is set in input', () => {
      directive.trim = true;
      expect(directive._getTrim()).toBe(true);
    });
    it('should be true if nothing is set in input', () => {
      expect(directive._getTrim()).toBe(true);
    });
  });
  describe('_getDebounce()', () => {
    it('should be 0 if the input is less than 0', () => {
      directive.debounce = -1000;
      expect(directive._getDebounce()).toBe(0);
    });
    it('should be 0 if the input is not numeric', () => {
      directive.debounce = 'foo' as any;
      expect(directive._getDebounce()).toBe(0);
    });
    it('should be 80 if the input is "80"', () => {
      directive.debounce = '80' as any;
      expect(directive._getDebounce()).toBe(80);
    });
    it('should be 80 if the input is 80', () => {
      directive.debounce = 80;
      expect(directive._getDebounce()).toBe(80);
    });
    it('should be 0 by default', () => {
      expect(directive._getDebounce()).toBe(0);
    });
  });
});
