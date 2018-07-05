import {
  FormControl
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
  INgxFireControlBindingOptions,
  INgxFireControlBinding,
  INgxFireFactory
} from './interfaces';


export class NgxFireControlBinding extends NgxFireBinding implements INgxFireControlBinding {

  constructor(
    factory: INgxFireFactory,
    control: FormControl,
    ref: Reference,
    options?: INgxFireControlBindingOptions
  ) {
    super(factory, control, ref, options);
  }

  get control(): FormControl {
    return this._control as FormControl;
  }

  get options(): INgxFireControlBindingOptions {
    return this._options as INgxFireControlBindingOptions;
  }

  get debounce(): number {
    const debounce = this.options ? parseInt(this.options.debounce as any, 10) : 0;
    return (isNaN(debounce) || 0 > debounce) ? 0 : debounce;
  }

  get trim(): boolean {
    if (this.options) {
      return this.options.trim !== false;
    }
    return true;
  }

  save() {
    if (this.control.status !== 'VALID') {
      this.status$.next(NgxFireStatus.CONTROL_INVALID);
      return;
    }
    const val = this.control.value;
    const dbValue = this.trim && typeof val === 'string' ? val.trim() : val;
    this.status$.next(NgxFireStatus.SAVING);
    this.ref.set(dbValue)
      .then(() => this.status$.next(NgxFireStatus.SAVED))
      .catch(this.onDbError.bind(this));
  }

  onDbValue(snap: DataSnapshot) {
    super.onDbValue(snap);
    this.factory.ngZone.runOutsideAngular(() => {
      this.control.setValue(snap.val(), {emitEvent: false});
      this.factory.ngZone.run(() => {});
    });
  }

  protected init() {
    combineLatest(this.control.valueChanges, this.control.statusChanges)
      .pipe(debounceTime(this.debounce))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.save();
      });
    }
}
