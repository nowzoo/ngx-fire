import {
  FormControl
} from '@angular/forms';

import { combineLatest, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  Reference,
  DataSnapshot
} from '@firebase/database';

import {
  NgxFireStatus,
  INgxFireFactory,
  INgxFireControlOptions,
  INgxFireControlBinding,
} from './interfaces';
import {
  NgxFireAbstractBinding
} from './ngx-fire-abstract-binding.class';

export class NgxFireControlBinding extends NgxFireAbstractBinding implements INgxFireControlBinding {

  private formSub: Subscription = null;

  get control(): FormControl {
    return this._control as FormControl;
  }

  get options(): INgxFireControlOptions {
    return this._options as INgxFireControlOptions;
  }

  get debounce(): number {
    const debounce = parseInt(this.options.debounce as any, 10);
    return isNaN(debounce) || debounce < 0 ? 0 : debounce;
  }

  get trim(): boolean {
    return this.options.trim !== false;
  }

  constructor(
    factory: INgxFireFactory,
    ref: Reference,
    options: INgxFireControlOptions,
    control: FormControl
  ) {
    super(factory, ref, options, control);
  }

  protected _start() {
    this.formSub = combineLatest(this.control.valueChanges, this.control.statusChanges)
      .pipe(debounceTime(this.debounce))
      .subscribe(() => {
        if (this.control.status !== 'VALID') {
          return;
        }
        const formVal = this.control.value;
        const dbVal = typeof formVal === 'string' && this.trim ? formVal.trim() : formVal;
        this.statusChanges$.next({status: NgxFireStatus.SAVING});
        this.ref.set(dbVal)
          .then(() => this.statusChanges$.next({status: NgxFireStatus.SAVED}))
          .catch(this.onDbError.bind(this));
      });
  }

  protected _stop() {
    if (this.formSub) {
      this.formSub.unsubscribe();
      this.formSub = null;
    }
  }

  onDbValue(snap: DataSnapshot) {
    this.control.setValue(snap.val(), {emitEvent: false});
    super.onDbValue(snap);
  }
}
