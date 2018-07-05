import { Injectable, NgZone } from '@angular/core';
import {
  AbstractControl, FormGroup, FormArray, FormControl
} from '@angular/forms';
import {
  Reference
} from '@firebase/database';
import {
  INgxFireFactory,
  INgxFireGroupBindingOptions,
  INgxFireArrayBindingOptions,
  INgxFireControlBindingOptions,
  INgxFireBinding,
  INgxFireGroupBinding,
  INgxFireArrayBinding,
  INgxFireControlBinding
} from './interfaces';

import { NgxFireGroupBinding } from './ngx-fire-group-binding';
import { NgxFireArrayBinding } from './ngx-fire-array-binding';
import { NgxFireControlBinding } from './ngx-fire-control-binding';

@Injectable({
  providedIn: 'root'
})
export class NgxFireFactory implements INgxFireFactory {

  constructor(public ngZone: NgZone) {}

  bind(
    control: AbstractControl,
    ref: Reference,
    options?: INgxFireGroupBindingOptions|INgxFireArrayBindingOptions|INgxFireControlBindingOptions): INgxFireBinding {
    if (control instanceof FormGroup) {
      return this.group(control, ref, options as INgxFireGroupBindingOptions);
    }
    if (control instanceof FormArray) {
      return this.array(control, ref, options as INgxFireArrayBindingOptions);
    }
    if (control instanceof FormControl) {
      return this.control(control, ref, options as INgxFireControlBindingOptions);
    }
  }

  group(control: FormGroup, ref: Reference, options?: INgxFireGroupBindingOptions): INgxFireGroupBinding {
    return new NgxFireGroupBinding(this, control, ref, options);
  }

  array(control: FormArray, ref: Reference, options?: INgxFireArrayBindingOptions): INgxFireArrayBinding {
    return new NgxFireArrayBinding(this, control, ref, options);
  }

  control(control: FormControl, ref: Reference, options?: INgxFireControlBindingOptions): INgxFireControlBinding {
    return new NgxFireControlBinding(this, control, ref, options);
  }


}
