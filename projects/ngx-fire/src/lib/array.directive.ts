import {
  Directive,
  Input,
  Host,
  Self,
  OnInit,
  OnDestroy,
  NgZone
} from '@angular/core';

import {
  Reference,
  Query,
  DataSnapshot
} from '@firebase/database';

import {
  FormArrayName,
  FormArray,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subscription
} from 'rxjs';



@Directive({
  selector: '[ngxFireArray]',
  exportAs: 'ngxFireArray'
})
export class NgxFireArrayDirective implements OnInit, OnDestroy {

  private _dbListener: any = null;
  private _query: Query;
  private _error$: BehaviorSubject<Error> = new BehaviorSubject(null);
  private _saving$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _value$: BehaviorSubject<any> = new BehaviorSubject(null);
  private _control: FormArray;
  private _arrayAddControl: FormGroup|FormControl;
  @Input() ngxFireArray: Reference;
  @Input() controlFactory: () => FormGroup|FormControl = () => new FormControl(null, [Validators.required]);

  constructor(
    @Host() @Self() private _formDirective: FormArrayName,
    private _ngZone: NgZone
  ) { }

  get error(): Observable<Error> {
    return this._error$.asObservable();
  }
  get saving(): Observable<boolean> {
    return this._saving$.asObservable();
  }

  get addControl(): FormGroup|FormControl {
    return this._arrayAddControl;
  }

  get length(): number {
    return this._control.length;
  }
  get controls(): any[] {
    return this._control.controls;
  }

  get value(): Observable<any> {
    return this._value$.asObservable();
  }

  get ref(): Reference {
    return this.ngxFireArray;
  }

  ngOnInit() {
    this._arrayAddControl = this.controlFactory();
    if (! (this.ngxFireArray instanceof Reference)) {
      throw new Error(
        'NgxFireControlDirective must provide a reference. ' +
        'Usage: [ngxFireArray]="myRef".'
      );
    }
    if (! this._formDirective) {
      throw new Error(
        'NgxFireArrayDirective must be used with a Reactive form array directive (FormArrayName). ' +
        'Usage: formArrayName="myName" [ngxFireArray]="myRef".'
      );
    }

    this._control = this._formDirective.control;
    this._query = this.ref.orderByKey();
    this._dbListener = this._query.on(
      'value',
      (snap: DataSnapshot) => this._onDbValue(snap),
      (error: Error) => this._onDbError(error)
    );
  }
  ngOnDestroy() {
    if (this._dbListener) {
      this._query.off('value', this._dbListener);
    }
  }

  push(val: any): void {
    const arrVal = this._control.value.map(e => e);
    arrVal.push(val);
    return this._save(arrVal);
  }

  remove(i: number): void {
    const arrVal = this._control.value.map(e => e);
    arrVal.splice(i, 1);
    return this._save(arrVal);
  }
  move(from: number, to: number): void {
    const arrVal = this._control.value.map(e => e);
    const moved = arrVal.splice(from, 1);
    arrVal.splice(to, 0, ...moved);
    return this._save(arrVal);
  }

  private _save(arrValue: any[]): void {
    this._saving$.next(true);
    this.ref.set(arrValue)
      .then(() => {
        this._saving$.next(false);
      })
      .catch((error: Error) => {
        this._onDbError(error);
      });

  }

  private _onDbValue(snap: DataSnapshot) {
    this._ngZone.runOutsideAngular(() => {
      const value = snap.val() || [];
      this._value$.next(snap.val());
      if (! Array.isArray(value)) {
        this._onDbError(new Error('Database value is not an array.'));
        return;
      }
      const dbLength = value.length;
      const controlLength = this._control.length;
      let n;
      if (controlLength > dbLength) {
        for (n = controlLength - 1; n >= dbLength; n--) {
          this._control.removeAt(n);
        }
      }
      if (controlLength < dbLength) {
        for (n = controlLength; n < dbLength; n++) {
          const control = this.controlFactory();
          (control as any).patchValue(value[n]);
          this._control.push(control);
        }
      }
      this._ngZone.run(() => {});
    });
  }

  private _onDbError(error: Error) {
    this._error$.next(error);
  }


}
