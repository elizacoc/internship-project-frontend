import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Observable, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly _baseurl = 'http://localhost:8081';

  isAuthenticated() {
      if(localStorage.getItem('authenticationToken') !== null){
      return true;
    }
      return false;
  }
  
  constructor(private _http: HttpClient) {}

  getUser(email: string): Observable<User>{
    return this._http.get(`${this._baseurl}/user/${email}`,) as Observable<User>
  }

  loginUser(formData: FormData): Observable<HttpResponse<string>>{
    return this._http.post(`${this._baseurl}/login`, formData, { responseType: 'text', observe: 'response', withCredentials: true }) as Observable<HttpResponse<string>>
  }

  logoutUser(): Observable<HttpResponse<string>>{
    return this._http.post(`${this._baseurl}/logout`, {}, {withCredentials: true}) as Observable<HttpResponse<string>>;
  }

  registerUser(user: User): Observable<User>{
    return this._http.post(`${this._baseurl}/user/register`, user) as Observable<User>;
  }

  updateUser(user: User): Observable<User>{
    return this._http.put(`${this._baseurl}/user/update`, user) as Observable<User>;
  }
}
