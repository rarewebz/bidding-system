import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotifierService} from 'angular-notifier';
import {AuthService} from '../../services/auth.service';
import {constants} from '../../constants/constant';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;

  constructor(private _formBuilder: FormBuilder, private notifier: NotifierService, private authService: AuthService, private router: Router) {


  }

  ngOnInit() {

    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required]
    });

  }

  ngOnDestroy() {
  }

  authenticate() {

    if (this.loginForm.valid) {

      let req = {
        email: this.loginForm.controls.email.value,
        password: this.loginForm.controls.password.value
      };

      this.authService.authenticate(req).subscribe(
        res => {
          if (res['success']) {

            localStorage.setItem(constants.access_token, res[constants.access_token]);
            localStorage.setItem(constants.refresh_token, res[constants.refresh_token]);
            localStorage.setItem(constants.user_name, res['user']['firstname'] + ' ' + res['user']['lastname']);
            localStorage.setItem(constants.email, res['user']['email']);

            this.router.navigate(['/dashboard']);

          } else {
            this.notifier.notify('error', res['message']);
          }
        }, error => {
          this.notifier.notify('error', 'Something went wrong, please try again!');
        }
      );

    } else {
      this.notifier.notify('warning', 'Please fill in a valid value for all required fields.');
    }

  }

}
