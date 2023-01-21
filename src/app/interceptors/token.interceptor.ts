import {
  HttpErrorResponse,
  HttpHandler,
  HttpHeaderResponse,
  HttpInterceptor, HttpParams,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse,
  HttpSentEvent, HttpUserEvent
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError} from 'rxjs';
import {NotifierService} from 'angular-notifier';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {constants} from '../constants/constant';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  isRefreshingToken: boolean = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private authService: AuthService, private router: Router, private notifier: NotifierService) {

  }


  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    if (token != undefined || token != null) {
      if (
        req.url.includes('user/auth') ||
        req.url.includes('user/create')

      ) {
        return req.clone();
      }
      return req.clone({setHeaders: {Authorization: 'Bearer ' + token}});
    } else {
      return req.clone();
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

    return next.handle(this.addToken(req, localStorage.getItem(constants.access_token))).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          if (req.url.includes('oauth/token')) {

            switch ((<HttpErrorResponse>error).status) {
              case 500:
                return this.displayAlert(req, next);
              case 403:
                return this.forbiddenError(req, next);
              case 404:
                return this.notFoundError(req, next);
              case 0:
                return this.connectionError(req, next);
              default:
                return throwError(error);

            }
          }
          switch ((<HttpErrorResponse>error).status) {
            case 401:
              return this.handleError(req, next);
            case 500:
              return this.displayAlert(req, next);
            case 403:
              return this.forbiddenError(req, next);
            case 404:
              return this.notFoundError(req, next);
            case 0:
              return this.connectionError(req, next);
            default:
              return throwError(error);

          }
        } else {
          return throwError(error);
        }
      }));
  }

  handleError(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);
      // const db = this.injector.get(DatabaseProvider);


      const request = {
        refreshToken: localStorage.getItem(constants.refresh_token)
      };

      /// check if the user already on the platform

      return this.authService.refreshToken(request).pipe(
        switchMap((res) => {

          this.tokenSubject.next(res['access_token']);

          localStorage.setItem(constants.access_token, res['access_token']);
          localStorage.setItem(constants.refresh_token, res['refresh_token']);

          this.isRefreshingToken = false;

          return next.handle(this.addToken(req, res['access_token']));

          // If we don't get a new token, we are in trouble so logout.
        })
        , catchError((error) => {
          // If there is an exception calling 'refreshToken', bad news so logout.
          return this.logoutUser();
        }),
      );

    } else {
      return this.tokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken(req, token));
        }));
    }
  }

  logoutUser() {
    // Route to the login page (implementation up to you)
    this.router.navigate(['/login']);
    localStorage.clear();
    return throwError('');
  }


  displayAlert(req: HttpRequest<any>, next: HttpHandler) {


    this.notifier.notify('danger', 'Something went wrong. please try again later.');

    return next.handle(req);
  }

  forbiddenError(req: HttpRequest<any>, next: HttpHandler) {


    this.notifier.notify('danger', 'The page or resources you were trying to reach is absolutely forbidden.');

    return next.handle(req);
  }

  notFoundError(req: HttpRequest<any>, next: HttpHandler) {

    this.notifier.notify('danger', 'The requested URL was not found on this server.');

    return next.handle(req);
  }


  connectionError(req: HttpRequest<any>, next: HttpHandler) {

    this.notifier.notify('danger', 'Your connection was interrupted.');

    return next.handle(req);

  }

}
