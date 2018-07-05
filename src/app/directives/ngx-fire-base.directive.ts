import {
  OnInit,
  OnDestroy,
  NgZone
} from '@angular/core';

import {
  FormArrayName,
  FormControlName
} from '@angular/forms';

import {
  Subject,
  BehaviorSubject,
  Observable
} from 'rxjs';

import {
  Reference,
  Query,
  DataSnapshot
} from '@firebase/database';

import {
  NgxFireRefDirective
} from './ngx-fire-ref.directive';


export abstract class NgxFireBaseDirective implements OnInit, OnDestroy {
  private _dbListener: any = null;
  private _ref: Reference;
  private _error$: BehaviorSubject<Error> = new BehaviorSubject(null);
  private _saving$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _value$: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(
    private _ngZone: NgZone,
    private _formDirective: FormArrayName | FormControlName,
    private _refDirective: NgxFireRefDirective
  ) { }

  get ref(): Reference {
    return this._ref;
  }
  get error(): Observable<Error> {
    return this._error$.asObservable();
  }
  get saving(): Observable<boolean> {
    return this._saving$.asObservable();
  }
  get value(): Observable<any> {
    return this._value$.asObservable();
  }

  get formDirective(): FormArrayName | FormControlName {
    return this._formDirective;
  }

  abstract get query(): Query;
  protected abstract handleDbValue(value: any): void;

  ngOnInit() {
    this._ref = this._refDirective.ref.child(this._formDirective.path.join('/'));
    this._dbListener = this.query.on('value', this.onDbValue, this.onDbError, this);
  }

  ngOnDestroy() {
    this.query.off('value', this._dbListener);
  }

  onDbValue(snap: DataSnapshot) {
    this._ngZone.runOutsideAngular(() => {
      const value = snap.val();
      this.handleDbValue(value);
      this._value$.next(value);
      this._ngZone.run(() => {});
    });
  }

  onDbError(error: Error) {
    this._error$.next(error);
  }

  protected setSaving(saving: boolean) {
    this._saving$.next(saving);
  }



}
