import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService:AuthService,private router:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem("token");
    let cond:boolean = true;
    if(cond){
      try{
        if(token != null){
          request = request.clone({
            setHeaders : {
              Authorization : `Bearer ${token}`
            }
          });
        }
      }
      catch(e)
      {
        console.log(e);
      }
    }
    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
        }
      }, error => {
        if(cond)
        {
          let status=error.status;
          if(status==401||status==403)
          {
            localStorage.clear();
            this.router.navigate(["auth"]);
          }
        }
      })
    );
  }
}
