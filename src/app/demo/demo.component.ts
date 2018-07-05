import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Reference } from '@firebase/database';
import { NgxFireFactory } from '../lib/ngx-fire-factory.service';
import { INgxFireGroupBinding } from '../lib/interfaces';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {
  @Input() baseRef: Reference;
  formId = 'app-lib-demo-form-';
  fg: FormGroup;
  addFriendFg: FormGroup;

  colors = [
    {label: 'Black', value: 'black'},
    {label: 'Pink', value: 'pink'},
    {label: 'None', value: null},
  ];

  binding: INgxFireGroupBinding;

  constructor(
    private fb: FormBuilder,
    private factory: NgxFireFactory
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

    this.binding = this.factory.group(this.fg, this.baseRef, {
      name: {trim: true, debounce: 500},
      friends: {
        createChild: this.getFriendFg.bind(this),
        childBindingOptions: {name: {trim: true, debounce: 500}}
      }
    });
  }

  getFriendFg() {
    return this.fb.group({
      name: ['', Validators.required],
      imaginary: [false]
    });
  }

}
