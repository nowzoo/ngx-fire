import {
  FormArray,
  FormControl,
  FormGroup,
  AbstractControl
} from '@angular/forms';

import {
  Reference
} from '@firebase/database';

import {
  combineLatest
} from 'rxjs';

import {
  takeUntil,
  debounceTime
} from 'rxjs/operators';

import {
  DataSnapshot
} from '@firebase/database';

import {
  NgxFireBinding
} from './ngx-fire-binding';

import {
  NgxFireStatus,
  INgxFireGroupBinding,
  INgxFireFactory,
  INgxFireArrayBindingOptions,
  INgxFireGroupBindingOptions,
  INgxFireControlBindingOptions
} from './interfaces';

export class NgxFireGroupBinding extends NgxFireBinding implements INgxFireGroupBinding {
  constructor(
    factory: INgxFireFactory,
    control: FormGroup,
    ref: Reference,
    options?: INgxFireGroupBindingOptions
  ) {
    super(factory, control, ref, options);
  }

  get control(): FormGroup {
    return this._control as FormGroup;
  }
  get options(): INgxFireGroupBindingOptions {
    return this._options as INgxFireGroupBindingOptions;
  }

  init() {
    Object.keys(this.control.controls).forEach(name => this._updateChildBinding(name));
  }

  _getChildBindingOptions(name: string): INgxFireGroupBindingOptions|INgxFireArrayBindingOptions|INgxFireControlBindingOptions {
      if (this.options && this.options[name]) {
      return this._options[name];
    }
    return null;
  }

  _updateChildBinding(
    name: string,
    options?: INgxFireGroupBindingOptions|INgxFireArrayBindingOptions|INgxFireControlBindingOptions) {

    const control = this.control.get(name);
    const ref = this.ref.child(name);
    options = options || this._getChildBindingOptions(name);
    const exists = this.childBindings.get(name);
    if (exists) {
      exists.destroy();
    }
    const binding = this.factory.bind(control, ref, options);
    this.childBindings.set(name, binding);
  }

  addControl(
    name: string,
    control: AbstractControl,
    options?: INgxFireGroupBindingOptions|INgxFireArrayBindingOptions|INgxFireControlBindingOptions) {
    this.control.addControl(name, control);
    this._updateChildBinding(name, options);
  }
  setControl(
    name: string,
    control: AbstractControl,
    options?: INgxFireGroupBindingOptions|INgxFireArrayBindingOptions|INgxFireControlBindingOptions) {
    this.control.setControl(name, control);
    this._updateChildBinding(name, options);
  }

  removeControl(name: string) {
    this.control.removeControl(name);
    const binding = this.childBindings.get(name);
    if (binding) {
      binding.destroy();
      this.childBindings.delete(name);
    }
  }



}
