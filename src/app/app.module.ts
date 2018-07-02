import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DemoComponent } from './demo/demo.component';
import { NgxFireModule } from './ngx-fire/ngx-fire.module';
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { DemoFgComponent } from './demo-fg/demo-fg.component';


@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
    DemoFgComponent,

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
