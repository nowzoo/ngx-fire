import {
  AbstractControl,
  FormGroup,
  FormArray,
  FormControl
} from '@angular/forms';

import { NgZone } from '@angular/core';


import {
  Observable
} from 'rxjs';

import { Reference } from '@firebase/database';

export enum NgxFireStatus {
  INITIALIZING,
  SYNCED,
  CONTROL_INVALID,
  SAVING,
  SAVED,
  DATABASE_ERROR
}


export interface INgxFireBinding {
  status: Observable<NgxFireStatus>;
  dbError: Observable<Error>;
  dbValue: Observable<any>;
  control: AbstractControl;
  ref: Reference;
  destroy: () => void;
  child: (name: string) => INgxFireBinding;
}

export interface INgxFireControlBinding extends INgxFireBinding {
  control: FormControl;
  save: () => void;
}


export interface INgxFireControlBindingOptions {
  debounce?: number;
  trim?: boolean;
}

export interface INgxFireArrayBinding extends INgxFireBinding {
  control: FormArray;
  push: (value) => void;
  remove: (i: number) => void;
}

export interface INgxFireArrayBindingOptions  {
  createChild?: () => FormGroup|FormControl;
  childBindingOptions?: INgxFireGroupBindingOptions|INgxFireControlBindingOptions;
}

export interface INgxFireGroupBindingOptions  {
  [key: string]: INgxFireGroupBindingOptions|INgxFireControlBindingOptions|INgxFireArrayBindingOptions;
}

export interface INgxFireGroupBinding extends INgxFireBinding {
  control: FormGroup;
  addControl: (
    name: string,
    control: AbstractControl,
    options?: INgxFireGroupBindingOptions|INgxFireArrayBindingOptions|INgxFireControlBindingOptions) => void;
  setControl: (
    name: string,
    control: AbstractControl,
    options?: INgxFireGroupBindingOptions|INgxFireArrayBindingOptions|INgxFireControlBindingOptions) => void;
  removeControl: (name: string) => void;
}



export interface INgxFireFactory {
  ngZone: NgZone;
  bind: (
    control: AbstractControl,
    ref: Reference,
    options?: INgxFireArrayBindingOptions|INgxFireGroupBindingOptions|INgxFireControlBindingOptions
  ) => INgxFireBinding;
  group: (control: FormGroup, ref: Reference, options?: INgxFireGroupBindingOptions) => INgxFireGroupBinding;
  array: (control: FormArray, ref: Reference, options?: INgxFireArrayBindingOptions) => INgxFireArrayBinding;
  control: (control: FormControl, ref: Reference, options?: INgxFireControlBindingOptions) => INgxFireControlBinding;
}
