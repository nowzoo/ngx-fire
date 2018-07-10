import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Reference } from '@firebase/database';
@Component({
  selector: 'app-demo-nested-array',
  templateUrl: './demo-nested-array.component.html',
  styleUrls: ['./demo-nested-array.component.css']
})
export class DemoNestedArrayComponent implements OnInit {

  @Input() baseRef: Reference;
  ref: Reference;
  fg: FormGroup;
  formId = 'app-demo-nested-array-';
  friendFgFactory: any;
  constructor(
    private fb: FormBuilder
  ) { }


  ngOnInit() {

    this.ref = this.baseRef.child('app-demo-nested-array');
    this.fg = this.fb.group({
      friends: this.fb.array([])
    });

    this.friendFgFactory = () => {
      return this.fb.group({
        name: ['', Validators.required],
        imaginary: [false],
        tags: this.fb.array([])
      });
    };
  }

  clearDemoData() {
    this.ref.set(null);
  }

}
