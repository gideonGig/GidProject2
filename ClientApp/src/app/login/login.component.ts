import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { AccountService } from '../services/account.service';
import { Observable } from "rxjs";




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit
{
  insertForm: FormGroup;
  Username: FormControl;
  Password: FormControl;

  //last url a user wanted to visit if he was redirected to login URL
  returnUrl: string;

  ErrorMessage: string;

  invalidLogin: boolean;

  private loginStatusGet : boolean;

  constructor( private acct: AccountService,
               private router: Router,
               private route: ActivatedRoute,
               private fb: FormBuilder
             ) { }

  onSubmit()
  {
    let userLogin = this.insertForm.value;

    this.acct.login(userLogin.Username, userLogin.Password).subscribe( result =>
    {
      let token = (<any>result).token;
      console.log(token);
      console.log(result.userRole);
      console.log("user logged in successfully");
      this.invalidLogin = false;
      console.log(this.returnUrl);
      this.router.navigateByUrl(this.returnUrl);
    },
      error =>
      {
        this.invalidLogin = true;

        this.ErrorMessage = "invalid details supplied";
        console.log(this.ErrorMessage);

      } )
  }

  ngOnInit()
  {
    this.Username = new FormControl('', [Validators.required]);
    this.Password = new FormControl('', [Validators.required]);

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.insertForm = this.fb.group({
      "Username": this.Username,
      "Password": this.Password
    });
  }


}
