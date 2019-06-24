import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../services/account.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Template } from '@angular/compiler/src/render3/r3_ast';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    [x: string]: any;
  insertForm: FormGroup;
  username: FormControl;
  password: FormControl;
  cpassword: FormControl;
  email: FormControl;
  invalidRegister: boolean;
  errorList: string[];
  modalMessage: string;

  test: any[] = [];

  constructor(private router: Router, private acc: AccountService, private fb: FormBuilder, private modalService: BsModalService) { }

  @ViewChild('template', { static: false }) modal: TemplateRef<any>;

  onSubmit()
  {
    let userRegister = this.insertForm.value;

    this.acc.register(userRegister.username, userRegister.Password, userRegister.email).subscribe(result =>
    {
      this.invalidRegister = true;
      this.router.navigate(['/login']);
    }, error => {

        this.errorList = [];
        for (var i = 0; i < error.error.value; i++)
        {
          this.errorList.push(error.error.value[i]);
          //console.log(error.error.value[i]);
        }

        //console.log(error);
        this.modalMessage = "your registration was unsuccesful";

        this.modalRef = this.modalService.show(this.modal);
      }
    );
   
  }
  
  MustMatch(passwordControl: AbstractControl): ValidatorFn
  {

    return (cpasswordControl: AbstractControl) : { [key : string]: boolean } | null =>
    {
      // return null if controls haven't initialised yet
      if (!passwordControl && !cpasswordControl)
      {
        return null;
      }
      // retunr null if another validator has already found an error in the matchingControl
      if (cpasswordControl.hasError && !passwordControl.hasError)
      {
        return null;
      }
      // set error or matching control if validation fails.
      if (passwordControl.value !== cpasswordControl.value) 
      {
        return { 'mustMatch': true };
      }
      else
      {
        return null;
      }
    }
  }

  ngOnInit()
  {
    this.username = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(5)]);
    this.password = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(5)]);
    this.cpassword = new FormControl('', [Validators.required,this.MustMatch(this.password)]);
    this.email = new FormControl('', [Validators.required]);
    this.errorList = [];

    this.insertForm = this.fb.group(
      {
        'username': this.username,
        'password': this.password,
        'cpassword': this.cpassword,
        'email': this.email
      });
  }


  
}
