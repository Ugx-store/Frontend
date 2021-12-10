import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  private users_url: string = "https://users-db.azurewebsites.net/api/Users"

  constructor(private http: HttpClient) { }

  checkUsername(username: string): Promise<number>{
    return this.http.get<number>(this.users_url + "/" + "user" + "/" + username).toPromise();
  }

  checkUsername_1(username: string): Observable<number> {
    return this.http.get<number>(this.users_url + "/" + "user" + "/" + username.toLocaleLowerCase()).pipe(
        tap(data => console.log(data)),
        catchError(this.handleError)
    );
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

}
