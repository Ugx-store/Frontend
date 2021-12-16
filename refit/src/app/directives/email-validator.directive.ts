import { Directive } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppServiceService } from '../services/app-service.service';

@Directive({
  selector: '[uniqueEmail]',
  providers: [{ provide: NG_ASYNC_VALIDATORS, useExisting: EmailValidatorDirective, multi: true }] 
})
export class EmailValidatorDirective implements AsyncValidator {

  constructor(private service: AppServiceService) {}

    validate(
    ctrl: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    
    return this.service.checkEmail(ctrl.value).pipe(
        map(isTaken => (isTaken ? { uniqueEmail: true } : null)),
        catchError(() => of(null))
    );
    }

}
