import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { NgxFireModule } from '@nowzoo/ngx-fire';

import { DemoComponent } from './demo/demo.component';
import { SavingStatusComponent } from './saving-status/saving-status.component';
import { DemoControlComponent } from './demo-control/demo-control.component';
import { DemoArrayComponent } from './demo-array/demo-array.component';
@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
    SavingStatusComponent,
    DemoControlComponent,
    DemoArrayComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgxFireModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
