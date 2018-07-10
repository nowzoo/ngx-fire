import {
  Directive,
  Input,
  Host,
  Self,
  Optional,
  OnInit,
  OnDestroy,
  NgZone
} from '@angular/core';
import {
  Reference,
  DataSnapshot
} from '@firebase/database';
import {
  FormControlName,
  FormControlDirective,
  FormControl,
} from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  Subscription
} from 'rxjs';
import {
  debounceTime
} from 'rxjs/operators';

@Directive({
  selector: '[ngxFireControl]',
  exportAs: 'ngxFireControl'
})
export class NgxFireControlDirective implements OnInit, OnDestroy {
  @Input() ngxFireControl: Reference;
  @Input() debounce = 0;
  @Input() trim = true;
  private _formDirective: FormControlName|FormControlDirective;
  private _dbListener: any = null;
  private _formSubscription: Subscription = null;
  private _error$: BehaviorSubject<Error> = new BehaviorSubject(null);
  private _value$: BehaviorSubject<any> = new BehaviorSubject(null);
  private _saving$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _control: FormControl;
  constructor(
    @Optional() @Host() @Self() d1: FormControlName,
    @Optional() @Host() @Self() d2: FormControlDirective,
    private _ngZone: NgZone
  ) {
    this._formDirective = [d1, d2].find(d => d !== null);
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
  get ref(): Reference {
    return this.ngxFireControl;
  }

  ngOnInit() {
    if (! (this.ngxFireControl instanceof Reference)) {
      throw new Error(
        'NgxFireControlDirective must provide a reference. ' +
        'Usage: [ngxFireControl]="myRef".'
      );
    }
    if (! this._formDirective) {
      throw new Error(
        'NgxFireControlDirective must be used with a Reactive form control directive (FormControlName or FormControlDirective). ' +
        'Usage: formControlName="myName" [ngxFireControl]="myRef" or [formControl]="myCtl" [ngxFireControl]="myRef".'
      );
    }
    this._control = this._formDirective.control;
    this._dbListener = this.ref.on(
      'value',
      (snap: DataSnapshot) => this._onDbValue(snap),
      (error: Error) => this._onDbError(error)
    );
    this._formSubscription = combineLatest(this._control.valueChanges, this._control.statusChanges)
      .pipe(debounceTime(this._getDebounce()))
      .subscribe(() => this.save());
  }
  ngOnDestroy() {
    if (this._dbListener) {
      this.ref.off('value', this._dbListener);
    }
    if (this._formSubscription) {
      this._formSubscription.unsubscribe();
    }
  }

  save(): void {
    if ('VALID' !== this._control.status) {
      return;
    }
    if (this._control.pristine) {
      return;
    }

    this._saving$.next(true);
    const val = this._control.value;
    const dbVal = this._getTrim() && typeof val === 'string' ? val.trim() : val;
    this.ref.set(dbVal)
      .then(() => {
        this._saving$.next(false);
      })
      .catch((error: Error) => {
        this._onDbError(error);
      });

  }

  private _onDbValue(snap: DataSnapshot) {
    this._ngZone.runOutsideAngular(() => {
      const value = snap.val();
      this._formDirective.control.setValue(value, {emitEvent: false});
      this._formDirective.control.markAsPristine();
      this._value$.next(value);
      this._ngZone.run(() => {});
    });
  }

  private _onDbError(error: Error) {
    this._error$.next(error);
  }


  private _getDebounce(): number {
    const debounce = parseInt(this.debounce as any, 10);
    return isNaN(debounce) || debounce < 0 ? 0 : debounce;
  }
  private _getTrim(): boolean {
    return this.trim !== false;
  }


}
