import { TestBed, inject } from '@angular/core/testing';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { NgxFireFactory } from './ngx-fire-factory.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { NgxFireGroupBinding } from './ngx-fire-group-binding';
import { NgxFireArrayBinding } from './ngx-fire-array-binding';
import { NgxFireControlBinding } from './ngx-fire-control-binding';

describe('NgxFireFactory', () => {
  let ref;
  let factory: NgxFireFactory;
  beforeEach(() => {
    ref = {
      on: jasmine.createSpy(),
    };
    TestBed.configureTestingModule({
      providers: [
        NgxFireFactory,
        {provide: AngularFireDatabase, useValue: {}}
      ]
    });
    factory = TestBed.get(NgxFireFactory);
  });



  describe('bind', () => {
    it('should call factory.group if passed a FormGroup', () => {
      spyOn(factory, 'group').and.returnValue(null);
      const control = new FormGroup({});
      const binding = factory.bind(control, ref);
      expect(factory.group).toHaveBeenCalledWith(control, ref, undefined);
    });
    it('should call factory.array if passed a FormArray', () => {
      spyOn(factory, 'array').and.returnValue(null);
      const control = new FormArray([]);
      const binding = factory.bind(control, ref);
      expect(factory.array).toHaveBeenCalledWith(control, ref, undefined);
    });
    it('should call factory.control if passed a FormControl', () => {
      spyOn(factory, 'control').and.returnValue(null);
      const control = new FormControl(null);
      const binding = factory.bind(control, ref);
      expect(factory.control).toHaveBeenCalledWith(control, ref, undefined);
    });
  });
  describe('group', () => {
    it('should return instance of NgxFireGroupBinding', () => {
      const control = new FormGroup({});
      const binding = factory.group(control, ref);
      expect(binding instanceof NgxFireGroupBinding).toBe(true);
    });
  });
  describe('array', () => {
    it('should return instance of NgxFireArrayBinding', () => {
      const control = new FormArray([]);
      const binding = factory.array(control, ref);
      expect(binding instanceof NgxFireArrayBinding).toBe(true);
    });
  });
  describe('control', () => {
    it('should return instance of NgxFireControlBinding', () => {
      const control = new FormControl(null);
      const binding = factory.control(control, ref);
      expect(binding instanceof NgxFireControlBinding).toBe(true);
    });
  });
});
