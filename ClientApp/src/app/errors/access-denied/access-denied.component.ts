import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnInit {

  h2Message: string;
  h1Message: string;

  constructor() { }

  ngOnInit() {
    this.h1Message = "403";
    this.h2Message = "Access Denied";
  }

}
