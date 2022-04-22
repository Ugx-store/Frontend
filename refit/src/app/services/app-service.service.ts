import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { User } from '../models/newUser';
import { Follow } from '../models/follow';
import {  ProfilePictures } from '../models/profilepic';
import { Product } from '../models/product';
import { ProductImage } from '../models/productImage';
import { Like } from '../models/like';
import { Counter } from '../models/counter';
import { Boost } from '../models/boost';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  private users_url: string = "https://users-db.azurewebsites.net/api/Users"
  private promocode_url: string = "https://users-db.azurewebsites.net/api/PromoCodes"
  private email_url: string = "https://users-db.azurewebsites.net/api/EmailSender/"
  private follow_url: string = "https://users-db.azurewebsites.net/api/Following"
  private profile_pic: string = "https://users-db.azurewebsites.net/api/ProfilePic"
  private product_url: string = "https://products-db.azurewebsites.net/api/Products"
  private product_image: string = "https://products-db.azurewebsites.net/api/ProductImages"
  private like_url: string = "https://products-db.azurewebsites.net/api/Likes"
  private boost_url: string = "https://products-db.azurewebsites.net/api/Boost"

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

  getUser(username: string): Observable<User>{
    return this.http.get<User>(this.users_url + "/" + username);
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

  getUserFollows(username: string): Observable<User[]>{
    return this.http.get<User[]>(this.follow_url + "/" + username);
  }

  getUserFollowersProfiles(username: string): Observable<User[]>{
    return this.http.get<User[]>(this.follow_url + "/followers" + "/" + username);
  }

  postProfilePicture(picture: ProfilePictures){
    return this.http.post(this.profile_pic, picture, {responseType: "text"});
  }

  getProfilePicture(username: string): Observable<Uint8Array[]>{
    return this.http.get<Uint8Array[]>(this.profile_pic + "/" + username);
  }

  getProfilePicturesList(username: string): Observable<ProfilePictures[]>{
    return this.http.get<ProfilePictures[]>(this.profile_pic + "/pictures/" + username);
  }

  addProduct(newProduct: Product): Promise<Product>{
    return this.http.post<Product>(this.product_url, newProduct).toPromise();
  }

  addProductImages(image: ProductImage[]){
    return this.http.post(this.product_image, image, {responseType: "text"})
  }

  getUserProducts(username: string): Observable<Product[]>{
    return this.http.get<Product[]>(this.product_url + "/user-products/" + username)
  }

  getOneProduct(id: number): Observable<Product>{
    return this.http.get<Product>(this.product_url + "/" + id)
  }

  likeAProduct(like: Like): Observable<Like>{
    return this.http.post<Like>(this.like_url, like)
  }

  unLikeAProduct(id: number): Observable<Like>{
    return this.http.delete<Like>(this.like_url + "/" + id)
  }

  boostAProduct(boost: Boost): Observable<Boost>{
    return this.http.post<Boost>(this.boost_url, boost)
  }

  endBoost(boost: Boost): Observable<Boost>{
    return this.http.put<Boost>(this.boost_url, boost)
  }

  getAllBoosts(): Observable<Boost>{
    return this.http.get<Boost>(this.boost_url)
  }

  //Method for the counter
  timeDiff(endTime: Date, count: Counter, offSetTime: number){
    const timeDifference = endTime.getTime() - (Date.now() + offSetTime)

      const counter = Math.floor(timeDifference / 1000)
      const counter1 = Math.floor(timeDifference / 60000)

      count.hours = Math.floor(counter1 / 60)

      count.minutes = (counter1 % 60)

      count.seconds = (counter % 60)
  } 

}
