import { Injectable } from '@angular/core';
import {
  Reference
} from '@firebase/database';
import {
  FormGroup,
  FormControl,
  FormArray,
  AbstractControlOptions
} from '@angular/forms';


import {
  INgxFireFactory,
  INgxFireAbstractOptions,
  INgxFireGroupOptions,
  INgxFireArrayOptions,
  INgxFireControlOptions,
  INgxFireAbstractBinding,
  INgxFireGroupBinding,
  INgxFireArrayBinding,
  INgxFireControlBinding
} from './interfaces';



import { NgxFireGroupBinding } from './ngx-fire-group-binding.class';
import { NgxFireArrayBinding } from './ngx-fire-array-binding.class';
import { NgxFireControlBinding } from './ngx-fire-control-binding.class';

@Injectable({
  providedIn: 'root'
})
export class NgxFireFactory implements INgxFireFactory {

  constructor() { }

  bind(ref: Reference, options: INgxFireAbstractOptions): INgxFireAbstractBinding {
    switch (options.type) {
      case 'group': return this.group(ref, options as INgxFireGroupOptions);
      case 'array': return this.array(ref, options as INgxFireArrayOptions);
      case 'control': return this.control(ref, options as INgxFireControlOptions);
    }
  }

  group(ref: Reference, options: INgxFireGroupOptions): INgxFireGroupBinding {
    const control = new FormGroup({});
    return new NgxFireGroupBinding(this, ref, options, control);
  }

  array(ref: Reference, options: INgxFireArrayOptions): INgxFireArrayBinding {
    const control = new FormArray([]);
    return new NgxFireArrayBinding(this, ref, options, control);
  }

  control(ref: Reference, options: INgxFireControlOptions): INgxFireControlBinding {
    const control = new FormControl(null, options as AbstractControlOptions);
    return new NgxFireControlBinding(this, ref, options, control);
  }

}
