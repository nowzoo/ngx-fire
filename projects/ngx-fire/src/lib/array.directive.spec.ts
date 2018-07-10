import { NgxFireArrayDirective } from './array.directive';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NgZone } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Reference } from '@firebase/database';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
describe('NgxFireArrayDirective', () => {
  let ref;
  let query;
  let dbListener;
  let formArray;
  let formDirective: any;
  let ngZone;
  let directive: NgxFireArrayDirective;
  let directiveValue;
  let directiveError;
  let directiveSaving;
  let ngUnsubscribe;
  afterEach(() => {
    ngUnsubscribe.next();
    ngUnsubscribe.complete();
  });
  beforeEach(() => {
    ngUnsubscribe = new Subject<void>();
    dbListener = {};
    query = {
      on: jasmine.createSpy().and.returnValue(dbListener),
      off: jasmine.createSpy(),
    };
    ref = {
      set: jasmine.createSpy().and.returnValue(Promise.resolve()),
      orderByKey: jasmine.createSpy().and.returnValue(query),
    };
    formArray = new FormArray([]);
    formDirective = {control: formArray};
    ngZone = TestBed.get(NgZone);
    directive = new NgxFireArrayDirective(formDirective, ngZone);
    directive.ngxFireArray = ref;
    directive.value.pipe(takeUntil(ngUnsubscribe)).subscribe(val => directiveValue = val);
    directive.error.pipe(takeUntil(ngUnsubscribe)).subscribe(val => directiveError = val);
    directive.saving.pipe(takeUntil(ngUnsubscribe)).subscribe(val => directiveSaving = val);
  });
  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set controls', () => {
      directive.ngOnInit();
      expect(directive.controls).toBe(formArray.controls);
    });
    it('should set length', () => {
      directive.ngOnInit();
      expect(directive.length).toBe(formArray.length);
    });
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
    it('should set addControl', () => {
      directive.ngOnInit();
      expect(directive.addControl).toBeTruthy();
    });
    it('should listen to db', () => {
      directive.ngOnInit();
      expect(query.on).toHaveBeenCalledWith('value', jasmine.any(Function), jasmine.any(Function), directive);
    });

    it('should throw if there is no ref', () => {
      directive.ngxFireArray = null;
      expect(() => {
        directive.ngOnInit();
      }).toThrow();
    });
    it('should throw if there is no form directive', () => {
      expect(() => {
        directive = new NgxFireArrayDirective(null, ngZone);
        directive.ngxFireArray = ref;
        directive.ngOnInit();
      }).toThrow();
    });
  });
  describe('ngOnDestroy', () => {
    it('should unlisten to db', () => {
      directive.ngOnInit();
      directive.ngOnDestroy();
      expect(query.off).toHaveBeenCalledWith('value', dbListener);
    });
  });

  describe('push(val)', () => {
    it('should set the ref', () => {
      directive.ngOnInit();
      directive.push('foo');
      expect(ref.set).toHaveBeenCalledWith(['foo']);
    });
    it('should set the ref if there are already elements', () => {
      formDirective = {control: {value: ['a', 'b']}};
      directive = new NgxFireArrayDirective(formDirective, ngZone);
      directive.ngxFireArray = ref;
      directive.ngOnInit();
      directive.push('foo');
      expect(ref.set).toHaveBeenCalledWith(['a', 'b', 'foo']);
    });
  });
  describe('remove(i)', () => {
    it('should set the ref', () => {
      formDirective = {control: {value: ['a', 'b']}};
      directive = new NgxFireArrayDirective(formDirective, ngZone);
      directive.ngxFireArray = ref;
      directive.ngOnInit();
      directive.remove(0);
      expect(ref.set).toHaveBeenCalledWith(['b']);
    });
  });
  describe('move(from, to)', () => {
    it('should set the ref', () => {
      formDirective = {control: {value: ['a', 'b']}};
      directive = new NgxFireArrayDirective(formDirective, ngZone);
      directive.ngxFireArray = ref;
      directive.ngOnInit();
      directive.move(0, 1);
      expect(ref.set).toHaveBeenCalledWith(['b', 'a']);
    });
  });
  describe('_save(dbVal)', () => {
    it('should set saving to true, then false', fakeAsync(() => {
      directive.ngOnInit();
      directive._save([]);
      expect(directiveSaving).toBe(true);
      tick();
      expect(directiveSaving).toBe(false);
    }));
    it('should set saving & error on failure', fakeAsync(() => {
      const err = new Error('foo');
      directive.ngOnInit();
      ref.set.and.returnValue(Promise.reject(err));
      directive._save([]);
      expect(directiveSaving).toBe(true);
      tick();
      expect(directiveSaving).toBe(false);
      expect(directiveError).toBe(err);
    }));
  });
  describe('_onDbError(e)', () => {
    it('should set the err', () => {
      const err = new Error('foo');
      directive._onDbError(err);
      expect(directiveError).toBe(err);
    });
  });
  describe('_onDbValue(snap)', () => {
    it('should deal with null', () => {
      const snap = {val: jasmine.createSpy().and.returnValue(null)};
      directive.ngOnInit();
      expect(directive.length).toBe(0);
      directive._onDbValue(snap);
      expect(directive.length).toBe(0);
    });
    it('should set en error with the db val is not null or an array', () => {
      const snap = {val: jasmine.createSpy().and.returnValue({foo: 8})};
      directive.ngOnInit();
      expect(Array.isArray({foo: 8})).toBe(false);
      expect(directiveError).not.toBeTruthy();
      directive._onDbValue(snap);
      expect(directiveError).toBeTruthy();
    });
    it('should create controls if the length of the value is greater than the form array length', () => {
      const snap = {val: jasmine.createSpy().and.returnValue(['a', 'b'])};
      directive.ngOnInit();
      expect(directive.length).toBe(0);
      spyOn(formArray, 'push').and.callThrough();
      spyOn(directive, 'controlFactory').and.callThrough();
      directive._onDbValue(snap);
      expect(formArray.push).toHaveBeenCalledTimes(2);
      expect(directive.controlFactory).toHaveBeenCalledTimes(2);
    });
    it('should remove controls if the length of the form array is greater than the value length', () => {
      const snap = {val: jasmine.createSpy().and.returnValue(['a', 'b'])};
      formArray.push(directive.controlFactory());
      formArray.push(directive.controlFactory());
      formArray.push(directive.controlFactory());
      directive.ngOnInit();
      expect(directive.length).toBe(3);
      spyOn(formArray, 'removeAt').and.callThrough();
      directive._onDbValue(snap);
      expect(formArray.removeAt).toHaveBeenCalledTimes(1);
    });


  });
});
