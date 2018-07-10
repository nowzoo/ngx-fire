import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Reference } from '@firebase/database';

@Component({
  selector: 'app-demo-array',
  templateUrl: './demo-array.component.html',
  styleUrls: ['./demo-array.component.css']
})
export class DemoArrayComponent implements OnInit {
  @Input() baseRef: Reference;
  ref: Reference;
  fg: FormGroup;
  formId = 'app-demo-array-';

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.ref = this.baseRef.child('app-demo-array');
    this.fg = this.fb.group({
      tags: this.fb.array([])
    });

  }
  clearDemoData() {
    this.ref.set(null);
  }

}
