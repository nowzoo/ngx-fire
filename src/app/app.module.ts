import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NgxFireFactory } from './lib/ngx-fire-factory.service';
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { DemoComponent } from './demo/demo.component';
import { StatusComponent } from './status/status.component';
import { DemoSimpleComponent } from './demo-simple/demo-simple.component';
import { NgxFireArrayDirective } from './directives/ngx-fire-array.directive';
import { NgxFireRefDirective } from './directives/ngx-fire-ref.directive';
import { NgxFireControlDirective } from './directives/ngx-fire-control.directive';
import { SaveStatusComponent } from './save-status/save-status.component';


@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
    StatusComponent,
    DemoSimpleComponent,
    NgxFireArrayDirective,
    NgxFireRefDirective,
    NgxFireControlDirective,
    SaveStatusComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ],
  providers: [NgxFireFactory],
  bootstrap: [AppComponent]
})
export class AppModule { }
