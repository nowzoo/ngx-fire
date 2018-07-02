import {
  FormGroup,
  AbstractControl
} from '@angular/forms';

import {
  Reference
} from '@firebase/database';

import {
  INgxFireFactory,
  INgxFireGroupOptions,
  INgxFireGroupBinding,
  INgxFireAbstractOptions,
  INgxFireAbstractBinding
} from './interfaces';
import {
  NgxFireAbstractBinding
} from './ngx-fire-abstract-binding.class';

export class NgxFireGroupBinding extends NgxFireAbstractBinding implements INgxFireGroupBinding {

  private bindings: Map<string, INgxFireAbstractBinding> = new Map();

  get control(): FormGroup {
    return this._control as FormGroup;
  }

  get options(): INgxFireGroupOptions {
    return this._options as INgxFireGroupOptions;
  }

  constructor(
    factory: INgxFireFactory,
    ref: Reference,
    options: INgxFireGroupOptions,
    control: FormGroup
  ) {
    super(factory, ref, options, control);
    Object.keys(this.options.children).forEach((name: string) => {
      this.add(name, this.options.children[name]);
    });
  }

  protected _start() {
    this.bindings.forEach((binding, name) => {
      const ref = this.ref.child(name);
      binding.start(ref);
    });
  }

  protected _stop() {
    this.bindings.forEach(b => b.stop());
  }

  add(name: string, options: INgxFireAbstractOptions): INgxFireAbstractBinding {
    const ref = this.ref.child(name);
    const exists = this.bindings.get(name);
    if (exists) {
      return exists;
    }
    const binding: INgxFireAbstractBinding = this.factory.bind(ref, options);
    this.control.addControl(name, binding.control);
    this.bindings.set(name, binding);
    if (this.started) {
      binding.start();
    }
    return binding;
  }

  set(name: string, options: INgxFireAbstractOptions): INgxFireAbstractBinding {
    const exists = this.bindings.get(name);
    if (exists) {
      this.remove(name);
    }
    return this.add(name, options);
  }

  remove(name: string): void {
    const binding = this.bindings.get(name);
    if (binding) {
      binding.stop();
      this.bindings.delete(name);
    }
    const control = this.control.get(name);
    if (control) {
      this.control.removeControl(name);
    }
  }

  get(name: string): INgxFireAbstractBinding {
    return this.bindings.get(name);
  }
}
