import { Directive } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppServiceService } from '../services/app-service.service';

@Directive({
  selector: '[uniqueUsername]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: AsyncValidatorDirective, multi: true }]
})
export class AsyncValidatorDirective implements AsyncValidator{

  constructor(private service: AppServiceService) {}

    validate(
    ctrl: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    console.log(ctrl.value)
    return this.service.checkUsername_1(ctrl.value).pipe(
        map(isTaken => (isTaken ? { uniqueUsername: true } : null)),
        catchError(() => of(null))
    );
    }


}

