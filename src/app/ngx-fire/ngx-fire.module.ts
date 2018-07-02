import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxFireFactory } from './ngx-fire.service';
@NgModule({
  imports: [
    CommonModule
  ],
  providers: [NgxFireFactory]
})
export class NgxFireModule { }
