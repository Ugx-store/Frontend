import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  get isLoggedIn(): boolean{
    const user = localStorage.getItem('refit_phoneNumber')

    return user !== null ? true : false;
  }
}
