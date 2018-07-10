import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Reference } from '@firebase/database';

@Component({
  selector: 'app-demo-radios',
  templateUrl: './demo-radios.component.html',
  styleUrls: ['./demo-radios.component.css']
})
export class DemoRadiosComponent implements OnInit {
  @Input() baseRef: Reference;
  ref: Reference;
  colors = [
    {label: 'Mauve', value: 'mauve'},
    {label: 'Taupe', value: 'taupe'},
    {label: 'None', value: null},
  ];
  formId = 'app-demo-radios-';
  fc: FormControl;
  constructor() { }

  ngOnInit() {
    this.ref = this.baseRef.child('app-demo-radios');
    this.fc = new FormControl(null);
  }

  clearDemoData() {
    this.ref.set(null);
  }

}
