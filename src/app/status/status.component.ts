import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { INgxFireBinding, NgxFireStatus } from '../lib/interfaces';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input() binding: INgxFireBinding;

  status: 'saving'| 'saved' = null;
  timeout: any = null;
  constructor() { }

  ngOnInit() {
    this.binding.status.pipe(takeUntil(this.ngUnsubscribe)).subscribe(val => {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      switch (val) {
        case NgxFireStatus.SAVING:
          this.status = 'saving';
          break;
        case NgxFireStatus.SAVED:
          this.status = 'saved';
          this.timeout = setTimeout(() => this.status = null, 3000);
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
