import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import {AuctionService} from '../../services/auction.service';
import {NotifierService} from 'angular-notifier';
import {constants} from '../../constants/constant';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './my-auction.component.html',
  styleUrls: ['./my-auction.component.scss']
})
export class MyAuctionComponent implements OnInit {

  public days: any;
  public hours: any;
  public minutes: any;
  public seconds: any;

  public myActions: Array<any> = [];

  constructor(private auctionService: AuctionService, private notifier: NotifierService, private router: Router) {


  }

  ngOnInit() {
    //getting auctions
    this.getMyAuctions();
  }


  getMyAuctions() {

    this.auctionService.getMyAuctions().subscribe(
      res => {

        if (res['success']) {

          this.myActions = res['body'];

        } else {
          this.notifier.notify('error', res['message']);
        }

      }, error => {
        this.notifier.notify('error', 'Something went wrong, please try again!');
      }
    );
  }

  getAuctionImage(image) {
    let styles;
    if (image.length > 0) {

      styles = {
        'background': 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%), url(' + image[0] + ')',
        'background-size': 'cover',
        'background-repeat': 'no-repeat',
        'background-position': 'center center',
        'box-shadow': '0px 5px 20px rgba(0, 0, 0, 0.15)'
      };
      return styles;
    } else {

      styles = {
        'background': 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%), url(https://glouton.b-cdn.net/site/images/no-image-wide.png)',
        'background-size': 'cover',
        'background-repeat': 'no-repeat',
        'background-position': 'center center',
        'box-shadow': '0px 5px 20px rgba(0, 0, 0, 0.15)'
      };
      return styles;
    }
  }

  navigateToAuction(auction) {

    let type = 'upcoming';

    if (this.checkDateIsPassed(auction['enddate'])) {
      type = 'end';
    }

    this.router.navigate(['/auction'], {state: {action: auction, type: type}});
  }


  getRemTime(ending) {
    ending= ending.replaceAll("Z","");
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
      return this.days + 'D ' + this.hours + 'H ' + this.minutes + 'M  ' + this.seconds + 'S Left';
    } else if (this.days == '0' && this.hours != '0' && this.minutes != '0' && this.seconds != '0') {
      return this.hours + 'H ' + this.minutes + 'M ' + this.seconds + 'S Left';
    } else if (this.days == '0' && this.hours == '0' && this.minutes != '0' && this.seconds != '0') {
      return this.minutes + 'M ' + this.seconds + 'S Left';
    } else {
      return this.seconds + 'S Left';
    }


    // console.log("Days: ", days);
    // console.log("Hours: ", hours);
    // console.log("Minutes: ", minutes);
    // console.log("Seconds: ", seconds);
  }

  checkDateIsPassed(dateTime) {
    dateTime = dateTime.replaceAll('Z', '');
    if (dateTime != null) {
      return moment(dateTime).isBefore();
    }
  }

}
