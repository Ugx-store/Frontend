import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  private users_url: string = "https://users-db.azurewebsites.net/api/Users"

  constructor(private http: HttpClient) { }

  checkUsername(username: string): Promise<number>{
    return this.http.get<number>(this.users_url + "/" + "user" + "/" + username).toPromise();
  }
}
