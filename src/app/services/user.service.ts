import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BACK_END_DOMAIN } from 'environments/env';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient,private router:Router) { }

  getProfile():Observable<User>
  {
    return this.http.get<User>(`${BACK_END_DOMAIN}/me`,
    { headers: new HttpHeaders().set('Content-type', 'application/json') });
  }

  addUser(data:any):Observable<any>
  {
    return this.http.post<any>(`${BACK_END_DOMAIN}/account/add`,data,
    { headers: new HttpHeaders().set('Content-type', 'application/json') });
  }

  toggleVerification(data:number):Observable<any>
  {
    return this.http.put<any>(`${BACK_END_DOMAIN}/user/verify/toggle`,{id:data},
    { headers: new HttpHeaders().set('Content-type', 'application/json') });
  }

  getUsers():Observable<User[]>
  {
    return this.http.get<User[]>(`${BACK_END_DOMAIN}/user`,
    { headers: new HttpHeaders().set('Content-type', 'application/json') });
  }

  getUser(id:number):Observable<User>
  {
    return this.http.get<User>(`${BACK_END_DOMAIN}/user/${id}`,
    { headers: new HttpHeaders().set('Content-type', 'application/json') });
  }

  getUserData()
  {
    return localStorage.getItem("user");
  }

  getName()
  {
    let data = this.getUserData();
    if(data)
    {
      return JSON.parse(data)?.name;
    }
    return "Account";
  }

  getRole():string[]
  {
    let data = this.getUserData();
    if(data)
    {
      let out:string[] = [JSON.parse(data)?.role];
      if(out[0].toLowerCase()=="admin")
        out.push("user");
      return out;
    }
    return [];
  }

  isAdmin():boolean
  {
    if(this.getRole().includes("admin"))
      return true;
    return false;
  }

}
