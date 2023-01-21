import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {constants} from '../constants/constant';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) {
  }

  loggedIn() {
    return !!localStorage.getItem(constants.access_token);
  }

  public authenticate(req): Observable<any> {
    return this.http.post(constants.main_url + constants.auth_path, req);
  }

  public refreshToken(req): Observable<any> {
    return this.http.post(constants.main_url + constants.refresh_path, req);
  }

  public registerUser(req): Observable<any> {
    return this.http.post(constants.main_url + constants.user_create_path, req);
  }

}
