import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import {constants} from '../../constants/constant';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  userName : any

  constructor(location: Location,  private element: ElementRef, private router: Router) {

    this.userName = localStorage.getItem(constants.user_name);

  }

  ngOnInit() {

  }
  getTitle(){

  }

  logOut(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
