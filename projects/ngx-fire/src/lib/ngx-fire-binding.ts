import {
  AbstractControl
} from '@angular/forms';

import {
  Reference,
  DataSnapshot
} from '@firebase/database';

import {
  Subject,
  BehaviorSubject,
  Observable
} from 'rxjs';

import {
  NgxFireStatus,
  INgxFireBinding,
  INgxFireFactory
} from './interfaces';


export abstract class NgxFireBinding implements INgxFireBinding {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  protected childBindings: Map<string|number, INgxFireBinding> = new Map();
  protected status$: BehaviorSubject<NgxFireStatus> = new BehaviorSubject(NgxFireStatus.INITIALIZING);
  protected dbError$: BehaviorSubject<Error> = new BehaviorSubject(null);
  protected dbValue$: BehaviorSubject<any> = new BehaviorSubject(null);
  private _dbValueListener: any = null;

  constructor(
    protected _factory: INgxFireFactory,
    protected _control: AbstractControl,
    protected _ref: Reference,
  ) {
    this._dbValueListener = this.ref.on('value', this.onDbValue, this.onDbError, this);
    this.init();
  }

  protected abstract init(): void;

  get status(): Observable<NgxFireStatus> {
    return this.status$.asObservable();
  }

  get dbError(): Observable<Error> {
    return this.dbError$.asObservable();
  }

  get dbValue(): Observable<any> {
    return this.dbValue$.asObservable();
  }

  get factory(): INgxFireFactory {
    return this._factory;
  }
  get control(): AbstractControl {
    return this._control;
  }
  get ref(): Reference {
    return this._ref;
  }


  child(name: string|number): INgxFireBinding {
    return this.childBindings.get(name);
  }

  destroy() {
    this.ref.off('value', this._dbValueListener);
    this.childBindings.forEach(childBinding => childBinding.destroy());
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onDbValue(snap: DataSnapshot) {
    this.dbValue$.next(snap.val());
    this.status$.next(NgxFireStatus.SYNCED);
  }

  onDbError(error: Error) {
    this.status$.next(NgxFireStatus.DATABASE_ERROR);
    this.dbError$.next(error);
    this.dbValue$.next(null);
  }
}
