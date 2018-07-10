import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { Reference } from '@firebase/database';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {
  @Input() baseRef: Reference;
  ref: Reference;
  formId = 'app-lib-demo-form-';
  fg: FormGroup;
  addFriendFg: FormGroup;
  createFriendFg: any;
  createFriendTagFg: any;

  colors = [
    {label: 'Black', value: 'black'},
    {label: 'Pink', value: 'pink'},
    {label: 'None', value: null},
  ];


  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.ref = this.baseRef.child('kitchen-sink');
    this.fg = this.fb.group({
      name: ['', [Validators.required]],
      agree_to_tos: [false],
      preferences: this.fb.group({
        favorite_color: [null]
      }),
      friends: this.fb.array([])
    });
    this.createFriendFg = () => {
      return this.fb.group({
        name: ['', [Validators.required]],
        imaginary: [false],
        preferences: this.fb.group({
          favorite_color: [null]
        }),
        tags: this.fb.array([])
      });
    };

    this.createFriendTagFg = () => {
      return this.fb.group({
        name: ['', [Validators.required]]
      });
    };
  }



}
