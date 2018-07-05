import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-save-status',
  templateUrl: './save-status.component.html',
  styleUrls: ['./save-status.component.css']
})
export class SaveStatusComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private recentlySavedTimeout: any = null;
  @Input() saving: Observable<boolean>;
  status: 'saving'|'saved' = null;
  constructor() { }

  ngOnInit() {
    this.saving.pipe(takeUntil(this.ngUnsubscribe)).subscribe(val => {
      if (this.recentlySavedTimeout) {
        clearTimeout(this.recentlySavedTimeout);
        this.recentlySavedTimeout = null;
      }
      if (val) {
        this.status = 'saving';
      } else {
        if (this.status === 'saving') {
          setTimeout(() => {
            this.status = 'saved';
            this.recentlySavedTimeout = setTimeout(() => this.status = null, 3000);
          }, 100);

        }
      }

    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
