import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { User } from '../models/newUser';
import { Follow } from '../models/follow';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  private users_url: string = "https://users-db.azurewebsites.net/api/Users"
  private promocode_url: string = "https://users-db.azurewebsites.net/api/PromoCodes"
  private email_url: string = "https://users-db.azurewebsites.net/api/EmailSender/"
  private follow_url: string = "https://users-db.azurewebsites.net/api/Following"

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

  addUser(newUser: User): Promise<User>{
    return this.http.post<User>(this.users_url, newUser).toPromise();
  }

  getUser(username: string): Promise<User>{
    return this.http.get<User>(this.users_url + "/" + username).toPromise();
  }

  updateUser(updatedUser: User): Promise<User>{
    return this.http.put<User>(this.users_url, updatedUser).toPromise();
  }

  followUser(follow: Follow): Observable<Follow>{
    return this.http.post<Follow>(this.follow_url, follow);
  }

  unFollowUser(userId: number): Observable<Follow>{
    return this.http.delete<Follow>(this.follow_url + "/" + userId);
  }

}
