import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {
  constructor(private router: Router,private authService:AuthService,private userService:UserService) {}
  
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(!this.authService.isLoggedIn()||!this.checkRoles(route?.data?.role,this.userService.getRole()))
    {
      this.router.navigate(["auth"]);
      localStorage.clear();
      return false;
    }
    return true;
  }

  private checkRoles(roles:string[],userRoles:string[])
  {
    for(let role of roles)
    {
        if(!userRoles.includes(role))
          return false;
    }
    return true;
  }
  
}
