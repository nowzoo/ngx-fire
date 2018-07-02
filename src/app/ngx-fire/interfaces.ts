import {
  AbstractControl,
  FormGroup,
  FormArray,
  FormControl,
  AbstractControlOptions,
  ValidatorFn,
  AsyncValidatorFn
} from '@angular/forms';

import { Reference } from '@firebase/database';

import { Observable } from 'rxjs';

export enum NgxFireStatus {
  STOPPED, STARTED, SYNCED, SAVING, SAVED, ERROR
}

export interface INgxFireStatusChange {
  status: NgxFireStatus;
  error?: Error;
  value?: any;
}

export interface INgxFireAbstractOptions {
  type: 'group'|'array'|'control';
}


export interface INgxFireGroupOptions extends INgxFireAbstractOptions {
  type: 'group';
  children: {[key: string]: INgxFireControlOptions|INgxFireArrayOptions|INgxFireGroupOptions};
}

export interface INgxFireArrayOptions {
  type: 'array';
  controlOptions: INgxFireGroupOptions|INgxFireControlOptions;
}

export interface INgxFireControlOptions {
  type: 'control';
  debounce?: number;
  trim?: boolean;
  validators?:	ValidatorFn | ValidatorFn[] | null;
  asyncValidators?:	AsyncValidatorFn | AsyncValidatorFn[];
  updateOn?:	'change' | 'blur' | 'submit';
}

export interface INgxFireFactory {
  bind: (ref: Reference, options: INgxFireAbstractOptions) => INgxFireAbstractBinding;
  group: (ref: Reference, options: INgxFireGroupOptions) => INgxFireGroupBinding;
  array: (ref: Reference, options: INgxFireArrayOptions) => INgxFireArrayBinding;
  control: (ref: Reference, options: INgxFireControlOptions) => INgxFireControlBinding;
}

export interface INgxFireAbstractBinding {
  ref: Reference;
  statusChanges: Observable<INgxFireStatusChange>;
  control: AbstractControl;
  factory: INgxFireFactory;
  start: (ref?: Reference) => void;
  stop: () => void;
}

export interface INgxFireGroupBinding extends INgxFireAbstractBinding {
  control: FormGroup;
  options: INgxFireGroupOptions;
  get(name: string): INgxFireAbstractBinding;
  set(name: string, options: INgxFireAbstractOptions): INgxFireAbstractBinding;
  add(name: string, options: INgxFireAbstractOptions): INgxFireAbstractBinding;
  remove(name: string): void;
}
export interface INgxFireArrayBinding extends INgxFireAbstractBinding {
  control: FormArray;
  options: INgxFireArrayOptions;
  push: (value: any) => void;
  insert: (index: number, value: any) => void;
  remove: (index: number) => void;
}
export interface INgxFireControlBinding extends INgxFireAbstractBinding {
  control: FormControl;
  options: INgxFireControlOptions;
}
