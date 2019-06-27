import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject } from "rxjs";
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AccountService
{

  //need HttpClient to communicate between server and web api
  constructor(private http: HttpClient, private router: Router) { }

  // url to access web api
  private baseUrlLogin: string = "api/account/login";
  private baseUrlRegister: string = "api/account/register";

  //user related properties
  private loginStatus = new BehaviorSubject<boolean> (this.checkLoginStatus());
  private userName = new BehaviorSubject<string>(localStorage.getItem('username'));
  private userRole = new BehaviorSubject<string>(localStorage.getItem('userRole'));

  //create Register
  register(username: string, Password: string, email: string)
  {
    return this.http.post<any>(this.baseUrlRegister, { username, Password, email }).pipe(
      map((result) =>
      {
        return result;
      }, error =>
        {
          return error;
        }
      )
    );
  }

  //create login method
  login(username: string, Password: string)
  {
    return this.http.post<any>(this.baseUrlLogin, { username, Password }).pipe(
      map((result) => {

        if (result && result.token)
        {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
         
          localStorage.setItem('loginStatus', '1');
          localStorage.setItem('jwt', result.token);
          localStorage.setItem('username', result.username);
          localStorage.setItem('expiration', result.expiration);
          localStorage.setItem('username', result.username);
          localStorage.setItem('userRole', result.userRole);


          this.loginStatus.next(true);
          this.userName.next(localStorage.getItem('username'));
          this.userRole.next(localStorage.getItem('userRole'));
        }

        return result;

        //error will be handled in Login component.
      } )

    );
  }
  logOut()
  {
    this.loginStatus.next(false);
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    localStorage.removeItem('expiration');
    localStorage.removeIem('userRole');
    localStorage.setItem('loginStatus', '0');
    this.router.navigate(['/login']);
    console.log("Logged Out Succesfully");

  }

  checkLoginStatus() : boolean
  {
    var loginCookie = localStorage.getItem("loginStatus");

    if (loginCookie == "1")
    {
      return true;
    }
    return false;
  }

  //private properties needs to be called for under components, create getters function
  get isLoggedIn()
  {
    return this.loginStatus.asObservable();
  }

  get currentUserName()
  {
    return this.userName.asObservable();
  }

  get currentUserRole()
  {
    return this.userRole.asObservable();
  }

}
