import {
  FormArray
} from '@angular/forms';

import {
  Reference,
  Query,
  DataSnapshot
} from '@firebase/database';

import {
  INgxFireFactory,
  INgxFireArrayOptions,
  INgxFireArrayBinding,
  NgxFireStatus,
  INgxFireAbstractBinding
} from './interfaces';

import {
  NgxFireAbstractBinding
} from './ngx-fire-abstract-binding.class';

export class NgxFireArrayBinding extends NgxFireAbstractBinding implements INgxFireArrayBinding {

  private bindings: Map<number, INgxFireAbstractBinding> = new Map();
  get control(): FormArray {
    return this._control as FormArray;
  }

  get options(): INgxFireArrayOptions {
    return this._options as INgxFireArrayOptions;
  }

  get length(): number {
    return this.control.length;
  }

  constructor(
    factory: INgxFireFactory,
    ref: Reference,
    options: INgxFireArrayOptions,
    control: FormArray
  ) {
    super(factory, ref, options, control);
  }


  protected _start() {
    const query = this.ref.orderByKey();
    this.addDbListener(query, 'value', this.resetBindings);
  }

  protected _stop() {
    this.bindings.forEach(b => b.stop());
    this.bindings.clear();
    while (this.control.length > 0) {
      this.control.removeAt(0);
    }
  }

  resetBindings(snap: DataSnapshot) {
    const value = snap.val() || [];
    const dbLength = value.length;
    const controlLength = this.control.length;
    if (controlLength === dbLength) {
      return;
    }

    let n: number;
    const indicesToDelete = [];
    const indicesToAdd = [];
    for (n = dbLength; n < controlLength; n++) {
      indicesToDelete.unshift(n);
    }
    for (n = controlLength; n < dbLength; n++) {
      indicesToAdd.push(n);
    }
    indicesToDelete.forEach(i => {
      this.bindings.get(i).stop();
      this.bindings.delete(i);
      this.control.removeAt(i);
    });
    indicesToAdd.forEach(i => {
      const ref: Reference = this.ref.child(i.toString());
      const binding = this.factory.bind(ref, this.options.controlOptions);
      this.bindings.set(i, binding);
      this.control.insert(i, binding.control);
      if (this.started) {
        binding.start();
      }
    });
    console.log(this.control.length, this.ref.toString());
  }

  insert(i: number, value: any): void {
    const arrVal = this.control.getRawValue();
    arrVal.splice(i, 0, value);
    this.statusChanges$.next({status: NgxFireStatus.SAVING});
    this.ref.set(arrVal)
      .then(() => {
        this.statusChanges$.next({status: NgxFireStatus.SAVED});
      })
      .catch(this.onDbError.bind(this));
  }

  push(value: any): void {
    const i = this.control.length;
    return this.insert(i, value);
  }

  remove(i): void {
    const arrVal = this.control.getRawValue();
    arrVal.splice(i, 1);
    this.statusChanges$.next({status: NgxFireStatus.SAVING});
    this.ref.set(arrVal)
      .then(() => {
        this.statusChanges$.next({status: NgxFireStatus.SAVED});
      })
      .catch(this.onDbError.bind(this));
  }


}
