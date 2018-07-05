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
  FormGroup,
  FormControl,
  FormArray,
  FormArrayName
} from '@angular/forms';

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
  selector: '[ngxFireArray]',
  exportAs: 'ngxFireArray'
})
export class NgxFireArrayDirective extends NgxFireBaseDirective implements OnInit, OnDestroy {
  @Input() createChild: () => FormGroup|FormControl = () => new FormControl(null);

  constructor(
    ngZone: NgZone,
    @Host() @Self() formArrayName: FormArrayName,
    @Host() refDirective: NgxFireRefDirective
  ) {
    super(ngZone, formArrayName, refDirective);
  }

  get control(): FormArray {
    return (this.formDirective as FormArrayName).control;
  }

  get query(): Query {
    return this.ref.orderByKey();
  }

  protected handleDbValue(value: any) {
    value = value || [];
    if (! Array.isArray(value)) {
      const error = new Error(
        'The database value is not an array. Form path:  Ref: ' + this.ref.toString()
      );
      this.onDbError(error);
      return;
    }
    const dbLength = value.length;
    const controlLength = this.control.length;

    let n;
    if (controlLength > dbLength) {
      for (n = dbLength; n < controlLength; n++) {
        this.control.removeAt(n);
      }
    }
    if (controlLength < dbLength) {
      for (n = controlLength; n < dbLength; n++) {
        this.control.push(this.createChild());
      }
    }
  }



  push(value: any) {
    const arrValue = this.control.getRawValue();
    arrValue.push(value);
    this.ref.set(arrValue).catch(this.onDbError.bind(this));
  }
  remove(i: number) {
    const arrValue = this.control.getRawValue();
    arrValue.splice(i, 1);
    this.ref.set(arrValue).catch(this.onDbError.bind(this));
  }

  move(from: number, to: number) {
    const arrValue = this.control.getRawValue();
    const moved = arrValue.splice(from, 1);
    arrValue.splice(to, 0, ...moved);
    this.ref.set(arrValue).catch(this.onDbError.bind(this));
  }

}
