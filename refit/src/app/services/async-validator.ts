import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppServiceService } from './app-service.service';

@Injectable({ providedIn: 'root' })

export class UniqueUsername implements AsyncValidator {
    constructor(private service: AppServiceService) {}

    validate(
    ctrl: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.service.checkUsername_1(ctrl.value).pipe(
        map(isTaken => (isTaken === 1 ? { uniqueUsername: true } : null)),
        catchError(() => of(null))
    );
    }
}