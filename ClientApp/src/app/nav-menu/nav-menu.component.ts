import { Component, OnInit } from '@angular/core';
import { Observable } from '../../../node_modules/rxjs';
import { AccountService } from '../services/account.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  constructor(private acc : AccountService, private productService : ProductService ) { }

  loginStatu$: Observable<boolean>;

  userName$: Observable<string>;

  ngOnInit()
  {
    this.loginStatu$ = this.acc.isLoggedIn;

    this.userName$ = this.acc.currentUserName;
  }

  onLogOut() {

    this.productService.clearCache();
    this.acc.logOut();
  }
 


}
