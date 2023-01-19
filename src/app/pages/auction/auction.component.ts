import {Component, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {PerfectScrollbarComponent} from 'ngx-perfect-scrollbar';

declare const google: any;

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss']
})
export class AuctionComponent implements OnInit {

  days;
  hours;
  minutes;
  seconds;

  remTime : string;

  @ViewChild(PerfectScrollbarComponent, {static: true})
  scrollbar?: PerfectScrollbarComponent;

  constructor() {
  }

  ngOnInit() {
    setInterval(()=>{
      this.remTime = this.getRemTime('2023-01-18T15:39:09Z');
    },1000);

  }

  setImage(image) {

    let styles;

    styles = {
      'background': 'url(' + image + ')',
      'background-size': 'cover',
      'background-repeat': 'no-repeat',
      'background-position': 'center center',
      'box-shadow': '0px 5px 20px rgba(0, 0, 0, 0.15)'
    };
    return styles;
  }

  goBack() {

  }

  getRemTime(ending) {
    var now = moment();
    var end = moment(ending); // another date
    var duration = moment.duration(end.diff(now));

    //Get Days and subtract from duration
    this.days = duration.days();
    duration.subtract(this.days, 'days');

    //Get hours and subtract from duration
    this.hours = duration.hours();
    duration.subtract(this.hours, 'hours');

    //Get Minutes and subtract from duration
    this.minutes = duration.minutes();
    duration.subtract(this.minutes, 'minutes');

    //Get seconds
    this.seconds = duration.seconds();

    if (this.days != '0' && this.hours != '0' && this.minutes != '0' && this.seconds != '0') {
      return this.days + 'D ' + this.hours + 'H ' + this.minutes + +'M  ' + this.seconds + 'S Left';
    } else if (this.days == '0' && this.hours != '0' && this.minutes != '0' && this.seconds != '0') {
      return this.hours + 'H ' + this.minutes + 'M ' + this.seconds + 'S Left';
    } else if (this.days == '0' && this.hours == '0' && this.minutes != '0' && this.seconds != '0') {
      return this.minutes + 'M ' + this.seconds + 'S Left';
    } else {
      return this.seconds + 'S Left';
    }
  }

}
