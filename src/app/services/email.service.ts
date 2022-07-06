import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BACK_END_DOMAIN } from 'environments/env';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http:HttpClient,private router:Router) { }

  sendMail(loginData:any){
    return this.http.post<any>(`${BACK_END_DOMAIN}/mail/send`,loginData, 
    { headers: new HttpHeaders().set('Content-type', 'application/json') });
  }
}
