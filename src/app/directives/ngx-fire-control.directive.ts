import {
  Directive,
  Self,
  Host,
  Input,
  OnInit,
  OnDestroy,
  NgZone
} from '@angular/core';

import {
  FormControl,
  FormControlName,
} from '@angular/forms';


import {
  Subject,
  combineLatest
} from 'rxjs';

import {
  takeUntil,
  debounceTime
} from 'rxjs/operators';

import {
  Reference,
  Query
} from '@firebase/database';

import {
  NgxFireBaseDirective
} from './ngx-fire-base.directive';

import {
  NgxFireRefDirective
} from './ngx-fire-ref.directive';

@Directive({
  selector: '[ngxFireControl]',
  exportAs: 'ngxFireControl'
})
export class NgxFireControlDirective extends NgxFireBaseDirective implements OnInit, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input() debounce = 0;
  @Input() trim = true;

  constructor(
    ngZone: NgZone,
    @Host() @Self() formControlName: FormControlName,
    @Host() refDirective: NgxFireRefDirective,
  ) {
    super(ngZone, formControlName, refDirective);
  }

  get query(): Query {
    return this.ref;
  }

  get control(): FormControl {
    return (this.formDirective as FormControlName).control;
  }

  protected handleDbValue(value) {
    console.log(value, this.ref.toString());
    this.control.setValue(value, {emitEvent: false});
    this.control.markAsPristine();
  }


  ngOnInit() {
    super.ngOnInit();
    combineLatest(this.control.valueChanges, this.control.statusChanges)
      .pipe(debounceTime(this.debounce))
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(this.save.bind(this));
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  save() {
    if (this.control.status !== 'VALID') {
      return;
    }
    if (this.control.pristine) {
      return;
    }
    this.setSaving(true);
    const val = this.control.value;
    const dbVal = this.trim && typeof val === 'string' ? val.trim() : val;
    this.ref.set(dbVal)
      .then(() => this.setSaving(false))
      .catch(this.onDbError.bind(this));
  }

}
