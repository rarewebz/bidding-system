import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {NotifierService} from 'angular-notifier';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registrationForm: FormGroup;

  mobile : any;

  constructor(private _formBuilder: FormBuilder, private notifier: NotifierService, private authService: AuthService, private router: Router) {


  }

  ngOnInit() {

    this.registrationForm = this._formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      mobile: ['', Validators.required],
      password: ['', Validators.required],
      conPassword: ['', Validators.compose([
        Validators.required,
        this.equalto('password'),
      ])]
    });

  }

  registerUser() {

    if (this.registrationForm.valid) {

      let req = {
        firstname: this.registrationForm.controls.firstName.value,
        lastname: this.registrationForm.controls.lastName.value,
        contact: this.mobile,
        email: this.registrationForm.controls.email.value,
        password: this.registrationForm.controls.password.value,
      };

      this.authService.registerUser(req).subscribe(
        res => {
          if (res['success']) {
            this.router.navigate(['/login']);
          }
          this.notifier.notify('success', res['message']);
        }, error => {
          this.notifier.notify('error', 'Something went wrong, please try again!');
        }
      );

    } else {
      this.notifier.notify('warning', 'Please fill in a valid value for all required fields.');
    }
  }

  hasError(e) {

  }

  getNumber(e) {
    this.mobile = e;
  }

  telInputObject(e) {

  }

  onCountryChange(e) {
  }

  equalto(field_name): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {

      let input = control.value;

      let isValid = control.root.value[field_name] == input;
      if (!isValid) {
        return {'equalTo': {isValid}};
      } else {
        return null;
      }
    };
  }


}
