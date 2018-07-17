# NgxFire

DEPRECATED REPOSITORY: [USE THIS REPO INSTEAD](https://github.com/nowzoo/ngx/tree/master/projects/ngx-fire)


Directives for binding Angular Reactive form controls and arrays to Firebase references.

[Demo Site](https://nowzoo.github.io/ngx-fire/) | [Demo Code](https://github.com/nowzoo/ngx-fire/tree/master/src/app)

## Install
```bash
npm i @nowzoo/ngx-fire --save
```

This library depends upon Firebase and the Angular Reactive Forms module. It's up to you how you create Firebase references: a good option is [angularfire2](https://github.com/angular/angularfire2).

## Quick Start

Import `NgxFireModule` and `ReactiveFormsModule`.
```typescript
import { ReactiveFormsModule } from '@angular/forms';
import { NgxFireModule } from '@nowzoo/ngx-fire';
// other imports...

@NgModule({
  imports: [
    ReactiveFormsModule,
    NgxFireModule,
    // etc..
  ]

})
export class SomeModule { }
```

Bind a control with `[ngxFireControl]="ref"`...
```html
<input
  type="text"
  class="form-control"
  placeholder="How's it going?"
  [formControl]="control"
  [ngxFireControl]="ref"
  #fc="ngxFireControl"
  debounce="1000"
  (blur)="fc.save()">
```

Bind a numerically indexed array with `[ngxFireArray]="ref"`...
```html
<div formArrayName="tags" [ngxFireArray]="ref" #tagsFa="ngxFireArray">
....
</div>
```

See the demos ([site](https://nowzoo.github.io/ngx-fire/), [code](https://github.com/nowzoo/ngx-fire/tree/master/src/app)) for concrete examples.

## API

### `NgxFireControlDirective`

Binds a FormControl to a reference. Must be used in conjunction with `FormControlDirective` (`[formControl]="ctl"`) or `FormControlName` (`formControlName="myName"`.)

selector: `[ngxFireControl]` exportAs: `ngxFireControl`

#### Inputs

- `ngxFireControl: Reference` Required.
- `debounce: number` Optional. Default: 0. The amount of time in milliseconds to debounce form control changes before saving. Useful for text controls.
- `trim: boolean` Optional. Default: true. If true, and if the control value is a string, the value will be trimmed before saving.

#### Methods

- `save(): void` Saves the current control value to the database. Rejects if the control is not valid or if there is a Firebase error.

#### Properties

- `error: Observable<Error>` Populated if the Firebase ref throws an error either reading or writing.
- `saving: Observable<boolean>` True if the control value is being saved to the database.
- `value: Observable<any>` The current database value.
- `ref: Reference` The reference you passed in via `ngxFireControl`


### `NgxFireArrayDirective`

Binds a FormArray to a reference. Must be used in conjunction with  `FormArrayName` (`formArrayName="myName"`.)

selector: `[ngxFireArray]` exportAs: `ngxFireArray`

#### Inputs

- `ngxFireArray: Reference` Required.
- `controlFactory: () => FormControl|FormGroup` Optional. A function that returns a group or control for each element of the array. By default this is a function that returns a FormControl with the `required` validator. Note that you should only pass an empty group or control: the value is set from the database.

#### Methods

- `push(value: any): void` Pushes `value` to the end of the array and saves to the database.
- `remove(i: number): void` Removes the element at `i` and saves the array to the database.
- `move(from: number, to: number): void` Moves the element at `from` to `to` and saves the array to the database.

#### Properties

- `error: Observable<Error>` Populated if the Firebase ref throws an error either reading or writing.
- `saving: Observable<boolean>` True if the array value is being saved to the database, i.e. when pushing, removing or moving.
- `value: Observable<any>` The current database value.
- `ref: Reference` The reference you passed in via `ngxFireArray`
- `addControl` An unattached FormGroup or FormControl, created with `controlFactory()` that you can use to push new elements to the array.
- `length: number` The length of the FormArray.
- `controls: (FormGroup|FormControl)[]` The child controls.

## Contributing
Contributions and suggestions are welcome.

Get started...
```bash
git clone git@github.com:nowzoo/ngx-fire.git
cd ngx-fire
npm i
ng build ngx-fire --prod
```

The library code is found in `projects/ngx-fire`.

The demo site code is in `src/app`.

This library was built with the Angular CLI, so...

```bash
# test the library...
ng test ngx-fire

# build the library...
ng build ngx-fire --prod

# serve the demo site locally...
ng serve
```

Note that changes to the library code **are not** automatically reflected in the locally-served demo site. You must run `ng build ngx-fire` whenever you make changes to the library. But the local server does watch for changes to the built library -- so you don't need to restart the server.

If you use [Wallaby](https://wallabyjs.com/) to run unit tests, select the `projects/ngx-fire/wallaby.js` as your config file.

## License
[MIT](https://github.com/nowzoo/ngx-fire/blob/master/LICENSE)
