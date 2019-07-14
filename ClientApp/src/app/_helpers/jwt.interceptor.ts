import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AccountService } from '../services/account.service';
import { Observable } from 'rxjs';


@Injectable(
{
     providedIn: 'root'
})


export class JwtInterceptor implements HttpInterceptor
{

  constructor(private acct: AccountService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
    // add authorization header with Jwt token

    let currentUser = this.acct.isLoggedIn;
    let token = localStorage.getItem('jwt');

    if (currentUser && token !== undefined) {
      request = request.clone({
        setHeaders:
        {
          Authorization: `Bearer ${token}`

        },

      });
    }

    return next.handle(request);
  }
}


