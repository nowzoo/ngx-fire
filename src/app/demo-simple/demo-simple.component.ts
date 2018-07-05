import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Reference } from '@firebase/database';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';

@Component({
  selector: 'app-demo-simple',
  templateUrl: './demo-simple.component.html',
  styleUrls: ['./demo-simple.component.css']
})
export class DemoSimpleComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input() baseRef: Reference;
  formId = 'app-lib-demo-form-';
  fg: FormGroup;
  addFriendFg: FormGroup;
  dbObj: AngularFireObject<any>;

  createFriendFormGroup: any;
  createTagControl: any;

  colors = [
    {label: 'Black', value: 'black'},
    {label: 'Pink', value: 'pink'},
  ];

  constructor(
    private afDb: AngularFireDatabase,
    private fb: FormBuilder
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

    this.createFriendFormGroup = () => {
      return this.fb.group({
        name: ['', Validators.required],
        imaginary: [false],
        addTag: this.fb.group({
          tag: ['', Validators.required]
        }),
        tags: this.fb.array([])
      });
    };

  }



  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
