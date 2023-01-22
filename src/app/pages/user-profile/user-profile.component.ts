import { Component, OnInit } from '@angular/core';
import {constants} from '../../constants/constant';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  firstName : string;
  lastName : string;
  email : string;
  contact : string;

  constructor() { }

  ngOnInit() {

    this.firstName = localStorage.getItem(constants.user_first_name);
    this.lastName = localStorage.getItem(constants.user_last_name);
    this.email = localStorage.getItem(constants.email);
    this.contact = localStorage.getItem(constants.user_contact);
  }

}
