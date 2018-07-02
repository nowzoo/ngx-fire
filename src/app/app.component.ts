import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Reference } from '@firebase/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ref: Reference;
  constructor(
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase
  ) {}
  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      this.ref = user ? this.afDb.database.ref(`ngx-fire-demo/${user.uid}`) as Reference : null;
    });
    this.afAuth.auth.signInAnonymously();
  }
}
