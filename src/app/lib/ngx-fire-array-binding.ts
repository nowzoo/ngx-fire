import {
  FormArray,
  FormControl,
  FormGroup
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
  INgxFireArrayBinding,
  INgxFireFactory,
  INgxFireArrayBindingOptions,
  INgxFireGroupBindingOptions,
  INgxFireControlBindingOptions
} from './interfaces';


export class NgxFireArrayBinding extends NgxFireBinding implements INgxFireArrayBinding {
  constructor(
    factory: INgxFireFactory,
    control: FormArray,
    ref: Reference,
    options?: INgxFireArrayBindingOptions
  ) {
    super(factory, control, ref, options);
  }

  get control(): FormArray {
    return this._control as FormArray;
  }

  get options(): INgxFireArrayBindingOptions {
    return this._options as INgxFireArrayBindingOptions;
  }

  get createChild(): () => FormGroup|FormControl {
    if (this.options && this.options.createChild) {
      return this.options.createChild;
    }
    return () => {
      return new FormControl();
    };
  }

  get childBindingOptions(): INgxFireGroupBindingOptions|INgxFireControlBindingOptions {
    if (this.options && this.options.childBindingOptions) {
      return this.options.childBindingOptions;
    }
    return null;
  }

  init() {

  }

  private addChild(key: string) {
    if (this.childBindings.get(key)) {
      return;
    }
    const control = this.createChild();
    this.control.push(control);
    const binding = this.factory.bind(control, this.ref.child(key), this.childBindingOptions);
    this.childBindings.set(key, binding);
  }

  private removeChild(key: string) {
    const binding = this.childBindings.get(key);
    if (! binding) {
      return;
    }
    const index = this.control.controls.indexOf(binding.control);
    this.control.removeAt(index);
    binding.destroy();
    this.childBindings.delete(key);
  }

  onDbValue(snap: DataSnapshot) {
    super.onDbValue(snap);
    this.factory.ngZone.runOutsideAngular(() => {
      const val = snap.val() || [];
      if (! Array.isArray(val)) {
        throw new Error('The database value is not an array.');
      }
      const dbLength = val.length;
      const controlsLength = this.control.length;
      let i;
      let binding;
      if (controlsLength > dbLength) {
        for (i = controlsLength - 1; i >= dbLength; i--) {
          binding = this.childBindings.get(i);
          binding.destroy();
          this.childBindings.delete(i);
          this.control.removeAt(i);
        }
      }
      if (dbLength > controlsLength) {
        for (i = controlsLength; i < dbLength; i++) {
          const control = this.createChild();
          binding = this.factory.bind(control, this.ref.child(i.toString()), this.childBindingOptions);
          this.childBindings.set(i, binding);
          this.control.insert(i, control);
        }
      }
      this.factory.ngZone.run(() => { });
    });



  }

  push(value: any) {
    const arrVal = this.control.getRawValue();
    arrVal.push(value);
    this.save(arrVal);
  }

  remove(i: number) {
    const arrVal = this.control.getRawValue();
    arrVal.splice(i, 1);
    this.save(arrVal);
  }

  save(arrVal: any[]) {
    this.status$.next(NgxFireStatus.SAVING);
    this.ref.set(arrVal)
      .then(() => this.status$.next(NgxFireStatus.SAVED))
      .catch(this.onDbError.bind(this));
  }

  insert(i: number, value: any) {
    const arrVal = this.control.getRawValue();
    arrVal.splice(i, 0, value);
    this.save(arrVal);
  }
}
