import { NgxFireModule } from './ngx-fire.module';

describe('NgxFireFormModule', () => {
  let ngxFireFormModule: NgxFireModule;

  beforeEach(() => {
    ngxFireFormModule = new NgxFireModule();
  });

  it('should create an instance', () => {
    expect(ngxFireFormModule).toBeTruthy();
  });
});
