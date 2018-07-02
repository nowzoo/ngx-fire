import {
  BehaviorSubject,
  Subject,
  Observable
} from 'rxjs';

import {
  Reference,
  Query,
  DataSnapshot
} from '@firebase/database';

import {
  AbstractControl
} from '@angular/forms';

import {
  NgxFireStatus,
  INgxFireStatusChange,
  INgxFireAbstractOptions,
  INgxFireAbstractBinding,
  INgxFireFactory
} from './interfaces';

export abstract class NgxFireAbstractBinding implements INgxFireAbstractBinding {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  private dbListeners: {query: Query, on: string, listener: any}[] = [];


  get ref(): Reference {
    return this._ref;
  }

  protected _started = false;
  get started(): boolean {
    return this._started;
  }

  protected statusChanges$: BehaviorSubject<INgxFireStatusChange> = new BehaviorSubject({status: NgxFireStatus.STOPPED});
  get statusChanges(): Observable<INgxFireStatusChange> {
    return this.statusChanges$.asObservable();
  }

  get factory(): INgxFireFactory {
    return this._factory;
  }

  get options(): INgxFireAbstractOptions {
    return this._options;
  }

  get control(): AbstractControl {
    return this._control;
  }

  constructor(
    private _factory: INgxFireFactory,
    private _ref: Reference,
    protected _options: INgxFireAbstractOptions,
    protected _control: AbstractControl
  ) {}

  protected abstract _init(): void;
  protected abstract _start(): void;
  protected abstract _stop(): void;


  start(ref?: Reference) {
    if (ref) {
      this._ref = ref;
    }
    if (this.statusChanges$.value.status !== NgxFireStatus.STOPPED) {
      this.stop();
    }
    this._started = true;
    this.statusChanges$.next({status: NgxFireStatus.STARTED});
    this.addDbListener(this.ref, 'value', this.onDbValue);
    this._start();
  }

  stop() {
    this._started = false;
    this._stop();
    this.dbListeners.forEach(entry => {
      entry.query.off(entry.on, entry.listener);
    });
    this.dbListeners = [];
    this.statusChanges$.next({status: NgxFireStatus.STOPPED});
  }

  onDbValue(snap: DataSnapshot) {
    this.statusChanges$.next({status: NgxFireStatus.SYNCED, value: snap.val()});
  }

  onDbError(error: Error) {
    this.statusChanges$.next({status: NgxFireStatus.ERROR, error: error});
  }

  protected addDbListener(query: Query, on: string, fn: any) {
    this.dbListeners.push({
      query: query,
      on: on,
      listener: query.on(on, fn, this.onDbError, this)
    });
  }

  destroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
