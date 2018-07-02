import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Reference } from '@firebase/database';
import { INgxFireGroupOptions, INgxFireGroupBinding } from '../ngx-fire/interfaces';
import { NgxFireFactory } from '../ngx-fire/ngx-fire.service';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {
  @Input() baseRef: Reference;

  boundGroup: INgxFireGroupBinding;
  addFriendFg: FormGroup;
  formId = 'app-demo-form-';


  constructor(
    private factory: NgxFireFactory,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.addFriendFg = this.fb.group({
      name: ['', Validators.required]
    });

    const groupOptions: INgxFireGroupOptions = {
      type: 'group',
      children: {
        name: {type: 'control', debounce: 500, trim: true, validators: [Validators.required]},
        friends: {
          type: 'array',
          controlOptions: {
            type: 'group',
            children: {
              name: {type: 'control', debounce: 500, trim: true},
              imaginary: {type: 'control'},
              favoriteColors: {
                type: 'array',
                controlOptions: {type: 'control', debounce: 500, trim: true}
              }
            }
          }
        }
      }
    };

    this.boundGroup = this.factory.group(this.baseRef, groupOptions);
    this.boundGroup.start();

  }

}
