import { Directive } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppServiceService } from '../services/app-service.service';

@Directive({
  selector: '[uniqueCodeExists]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: PromoCodeValidatorDirective, multi: true }]
})
export class PromoCodeValidatorDirective implements AsyncValidator {

  constructor(private service: AppServiceService) {}

    validate(
    ctrl: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    
    return this.service.checkPromoCode(ctrl.value).pipe(
        map(isTaken => (isTaken ? null : { uniqueCodeExists: true })),
        catchError(() => of(null))
    );
    }

}
