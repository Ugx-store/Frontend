import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { newUser } from '../models/newUser';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  private users_url: string = "https://users-db.azurewebsites.net/api/Users"
  private promocode_url: string = "https://users-db.azurewebsites.net/api/PromoCodes"
  private email_url: string = "https://users-db.azurewebsites.net/api/EmailSender/"

  constructor(private http: HttpClient) { }

  checkUsername(username: string): Observable<number> {
    return this.http.get<number>(this.users_url + "/" + "user" + "/" + username.toLocaleLowerCase()).pipe(
        tap(data => console.log(data)),
        catchError(this.handleError)
    );
  }

  checkEmail(email: string): Observable<number> {
    return this.http.get<number>(this.users_url + "/" + "email" + "/" + email.toLocaleLowerCase()).pipe(
        tap(data => console.log(data)),
        catchError(this.handleError)
    );
  }

  checkPromoCode(code: string): Observable<number>{
    return this.http.get<number>(this.promocode_url + "/" +  code.toLocaleLowerCase()).pipe(
      tap(data => console.log(data)),
      catchError(this.handleError)
    )
  }

  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {

        errorMessage = `An error occurred: ${err.error.message}`;
    } else {

        errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

  checkPhoneNumber(phoneNumber: string): Promise<number> {
    return this.http.get<number>(this.users_url + "/" + "phone" + "/" + phoneNumber).toPromise();
  }

  addUser(newUser: newUser): Promise<newUser>{
    return this.http.post<newUser>(this.users_url, newUser).toPromise();
  }

  updateUser(updatedUser: newUser): Promise<newUser>{
    return this.http.put<newUser>(this.users_url, updatedUser).toPromise();
  }

}
