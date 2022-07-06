import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BACK_END_DOMAIN } from 'environments/env';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient,private router:Router) { }

  login(loginData:any){
    return this.http.post<any>(`${BACK_END_DOMAIN}/account/login`,loginData, 
    { headers: new HttpHeaders().set('Content-type', 'application/json') });
  }

  register(data:any)
  {
    return this.http.post<any>(`${BACK_END_DOMAIN}/account/signup`,data, 
    { headers: new HttpHeaders().set('Content-type', 'application/json') });
  }
  changePassword(data:any)
  {
    return this.http.put<any>(`${BACK_END_DOMAIN}/user/password/change`,data, 
    { headers: new HttpHeaders().set('Content-type', 'application/json') });
  }

  startSession(data:any)
  {
    localStorage.clear();
    localStorage.setItem("token",data?.token);
    localStorage.setItem("user",JSON.stringify(data?.user));
    this.router.navigate(["dashboard"]);
  }
  destroySession()
  {
    this.http.delete<any>(`${BACK_END_DOMAIN}/account/logout`, 
    { headers: new HttpHeaders().set('Content-type', 'application/json') })
    .subscribe(response=>{},err=>{console.log(err)}).add(()=>{
      localStorage.clear();
      this.router.navigate(["auth"]);
    });
  }

  isLoggedIn():boolean
  {
    return localStorage.getItem("token")?true:false;
  }

}
