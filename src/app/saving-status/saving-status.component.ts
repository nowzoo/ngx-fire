import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-saving-status',
  templateUrl: './saving-status.component.html',
  styleUrls: ['./saving-status.component.css']
})
export class SavingStatusComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input() saving: Observable<boolean>;
  status: 'saving'|'saved' = null;
  timeout: any = null;
  constructor() { }

  ngOnInit() {
    this.saving.pipe(takeUntil(this.ngUnsubscribe)).subscribe((b: boolean) => {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      if (b) {
        this.status = 'saving';
      } else {
        if (this.status === 'saving') {
          setTimeout(() => {
            this.timeout = setTimeout(() => this.status = null, 2000);
            this.status = 'saved';
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
