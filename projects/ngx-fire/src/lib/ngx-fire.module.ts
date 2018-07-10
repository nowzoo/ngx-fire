import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxFireArrayDirective } from './array.directive';
import { NgxFireControlDirective } from './control.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NgxFireArrayDirective,
    NgxFireControlDirective,
  ],
  exports: [
    NgxFireArrayDirective,
    NgxFireControlDirective,
  ]
})
export class NgxFireModule { }
