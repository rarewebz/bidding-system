import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import {NotifierModule, NotifierOptions} from 'angular-notifier';
import {AuthService} from './services/auth.service';
import {NgProgressHttpModule} from 'ngx-progressbar/http';
import {NgProgressModule} from 'ngx-progressbar';
import {AuthGuard} from './guards/auth.guard';
import {AuctionService} from './services/auction.service';
import {TokenInterceptor} from './interceptors/token.interceptor';


const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'left',
      distance: 12
    },
    vertical: {
      position: 'top',
      distance: 12,
      gap: 10
    }
  },
  theme: 'uifort',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    Ng2TelInputModule,
    PerfectScrollbarModule,
    NotifierModule,
    NgProgressHttpModule,
    NgProgressModule.withConfig({color: '#000000'}),

  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    AuthGuard,
    AuthService,
    AuctionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
