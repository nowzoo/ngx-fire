import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Reference, DataSnapshot } from '@firebase/database';
import { BehaviorSubject, Observable, Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AngularFireDatabase } from 'angularfire2/database';



@Component({
  selector: 'app-demo-fg',
  templateUrl: './demo-fg.component.html',
  styleUrls: ['./demo-fg.component.css']
})
export class DemoFgComponent implements OnInit, OnDestroy {
  @Input() baseRef: Reference;
  formId = 'app-demo-fg-form-';
  fg: FormGroup;
  addFriendFg: FormGroup;

  colors = [
    {label: 'Black', value: 'black'},
    {label: 'Pink', value: 'pink'},
    {label: 'None', value: null},
  ];

  fgBinding: any;

  constructor(
    private fb: FormBuilder,
    private afDb: AngularFireDatabase
  ) { }

  ngOnInit() {
    this.addFriendFg = this.fb.group({
      name: ['', Validators.required]
    });
    this.fg = this.fb.group({
      name: ['', Validators.required],
      preferences: this.fb.group({
        favorite_color: [null]
      }),
      friends: this.fb.array([])
    });
    this.fgBinding = this.bindGroup(this.fg, this.baseRef);
    this.fgBinding.bindArray('friends', this.getFriendFg.bind(this));
  }
  ngOnDestroy() {
    this.fgBinding.destroy();
  }

  getFriendFg() {
    return this.fb.group({
      name: ['', Validators.required],
      imaginary: [false]
    });
  }

  bindControl(control: FormControl, ref: Reference) {
    const ngUnsubscribe: Subject<void> = new Subject<void>();
    const obj = this.afDb.object(ref);
    const status: BehaviorSubject<string> = new BehaviorSubject('INITIALIZING');
    obj.valueChanges()
      .pipe(takeUntil(ngUnsubscribe))
      .subscribe(val => {
        control.setValue(val, {emitEvent: false});
        status.next('SYNCED');
      });
    control.valueChanges
      .pipe(takeUntil(ngUnsubscribe))
      .subscribe(val => {
        if ('VALID' !== control.status) {
          status.next('INVALID');
          return;
        }
        status.next('SAVING');
        obj.set(val)
          .then(() => status.next('SAVED'))
          .catch(() => status.next('ERROR'));
      });
    return {
      destroy: () => {
        ngUnsubscribe.next();
        ngUnsubscribe.complete();
      },
      status: status.asObservable()
    };

  }

  bindGroup(group: FormGroup, ref: Reference) {
    const ngUnsubscribe: Subject<void> = new Subject<void>();
    const controls: any = {};
    Object.keys(group.controls).forEach(key => {
      const control = group.get(key);
      if (control instanceof FormControl) {
        controls[key] = this.bindControl(control, ref.child(key));
      }
      if (control instanceof FormGroup) {
        controls[key] = this.bindGroup(control, ref.child(key));
      }
    });
    const bindArray = (key: string, create: () => FormGroup | FormControl) => {
      controls[key] = this.bindArray(group.get(key) as FormArray, ref.child(key), create);
    };
    return {
      controls: controls,
      bindArray: bindArray,
      destroy: () => {
        Object.keys(controls).forEach((key) => {
          controls[key].destroy();
        });
      }
    };

  }

  bindArray(array: FormArray, ref: Reference, create: () => FormGroup | FormControl) {
    const ngUnsubscribe: Subject<void> = new Subject<void>();
    const status: BehaviorSubject<string> = new BehaviorSubject('INITIALIZING');
    const list = this.afDb.list(ref, (r) => r.orderByKey());
    const children: {control: FormGroup | FormControl, key: string, binding: any}[] = [];
    const addChild = (key: string) => {
      const exists = children.find(o => o.key === key);
      if (! exists) {

        const control = create();
        const index = array.length;
        let binding;
        array.push(control);
        if (control instanceof FormGroup) {
          binding = this.bindGroup(control, ref.child(key));
        }
        if (control instanceof FormControl) {
          binding = this.bindControl(control, ref.child(key));
        }
        children.push({key: key, control: control, binding: binding});
      }
    };
    const removeChild = (key: string) => {
      const exists = children.find(o => o.key === key);
      if (exists) {
        const index = array.controls.indexOf(exists.control);
        array.removeAt(index);
        exists.binding.destroy();
        children.splice(children.indexOf(exists), 1);
      }
    };
    list.stateChanges(['child_removed'])
      .pipe(takeUntil(ngUnsubscribe))
      .subscribe(action => {
        console.log('child_removed', action);
        removeChild(action.key);
      });

    list.stateChanges(['child_added'])
      .pipe(takeUntil(ngUnsubscribe))
      .subscribe(action => {
        console.log('child_added', action);
        addChild(action.key);
      });


    list.valueChanges()
      .pipe(takeUntil(ngUnsubscribe))
      .subscribe(val => {
        status.next('SYNCED');
      });

    const push = (val) => {
      status.next('SAVING');
      list.push(val).then(() => status.next('SAVED'));
    };
    const remove = (i) => {
      const control = array.at(i);
      const exists = children.find(o => o.control === control);
      if (exists) {
        status.next('SAVING');
        list.remove(exists.key).then(() => status.next('SAVED'));
      }
    };
    return {
      status: status.asObservable(),
      push: push,
      remove: remove,
      destroy: () => {
        ngUnsubscribe.next();
        ngUnsubscribe.complete();
        children.forEach(o => o.binding.destroy());
      }
    };
  }

}
