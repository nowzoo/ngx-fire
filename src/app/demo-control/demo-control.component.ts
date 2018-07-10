import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Reference } from '@firebase/database';

@Component({
  selector: 'app-demo-control',
  templateUrl: './demo-control.component.html',
  styleUrls: ['./demo-control.component.css']
})
export class DemoControlComponent implements OnInit {
  @Input() baseRef: Reference;
  ref: Reference;
  control: FormControl;
  formId = 'app-demo-control-';
  constructor() { }

  ngOnInit() {
    this.control = new FormControl('');
    this.ref = this.baseRef.child('app-demo-control');
  }

}
