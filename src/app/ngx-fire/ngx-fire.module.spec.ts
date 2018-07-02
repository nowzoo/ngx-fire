import { NgxFireModule } from './ngx-fire.module';

describe('NgxFireModule', () => {
  let ngxFireModule: NgxFireModule;

  beforeEach(() => {
    ngxFireModule = new NgxFireModule();
  });

  it('should create an instance', () => {
    expect(ngxFireModule).toBeTruthy();
  });
});
