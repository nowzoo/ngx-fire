import {
  Directive,
  Input,
  Self,
  Host,
} from '@angular/core';

import {
  Reference
} from '@firebase/database';
import {
  FormGroupDirective,
  AbstractControl,
} from '@angular/forms';


@Directive({
  selector: '[ngxFireRef]'
})
export class NgxFireRefDirective  {
  @Input() ngxFireRef: Reference;

  constructor(
    @Self() @Host() private _formGroupDirective: FormGroupDirective
  ) {}

  get formGroupDirective(): FormGroupDirective {
    return this._formGroupDirective;
  }
  get ref(): Reference {
    return this.ngxFireRef;
  }

}
