import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {PerfectScrollbarComponent} from 'ngx-perfect-scrollbar';
import {ActivatedRoute} from '@angular/router';
import {map, timeInterval} from 'rxjs';
import {constants} from '../../constants/constant';
import {Location} from '@angular/common';
import {AuctionService} from '../../services/auction.service';
import {NotifierService} from 'angular-notifier';
import {Socket} from 'ngx-socket-io';

declare const google: any;

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss']
})
export class AuctionComponent implements OnInit, OnDestroy {

  days;
  hours;
  minutes;
  seconds;

  remTime: string;

  auction: any;
  type: any;

  acTimeInterval: any;

  ownerName: string;

  @ViewChild(PerfectScrollbarComponent, {static: true})
  scrollbar?: PerfectScrollbarComponent;

  socketId: any;

  userId: any;

  bids: Array<any> = [];

  bidAmount: any;

  constructor(private activatedRoute: ActivatedRoute, private location: Location, private auctionService: AuctionService, private notifier: NotifierService, private socket: Socket) {

    this.userId = localStorage.getItem(constants.user_id);
  }

  ngOnInit() {

    this.activatedRoute.paramMap
      .pipe(map(() => window.history.state)).subscribe(
      data => {
        this.auction = data['action'];
        this.type = data['type'];
      }
    );

    this.getAuctionOwner();
    this.getAllBids();

    this.acTimeInterval = setInterval(() => {
      this.remTime = this.getRemTime(this.auction['enddate']);
    }, 1000);

    setTimeout(() => {
      if (!this.checkDateIsPassed(this.auction['enddate'])) {
        this.subToAuction();
        this.listenToBids();
      }
    }, 1000);

  }

  subToAuction() {

    this.socket.emit('channel-join', {auctionId: this.auction['_id'], userId: this.userId});
  }

  makeABid(amount) {

    if (amount > this.auction['initialprice']['$numberDecimal']) {
      if (this.bids.length > 0) {
        if (amount > parseInt(this.bids[this.bids.length - 1]['bid']['$numberDecimal'])) {
          if (!this.checkDateIsPassed(this.auction['enddate'])) {
            let socketId = this.socket.ioSocket.id;
            this.socket.emit('bid', {channelId: this.auction['_id'], socketId: socketId, amount: amount});
          } else {
            this.notifier.notify('error', 'Sorry, this auction is expired!');
          }
        } else {
          this.notifier.notify('error', 'Sorry, you cannot bid this amount!');
        }
      } else {
        if (!this.checkDateIsPassed(this.auction['enddate'])) {
          let socketId = this.socket.ioSocket.id;
          this.socket.emit('bid', {channelId: this.auction['_id'], socketId: socketId, amount: amount});
        } else {
          this.notifier.notify('error', 'Sorry, this auction is expired!');
        }
      }

    } else {
      this.notifier.notify('error', 'Sorry, you cannot bid this amount!');
    }
  }

  listenToBids() {
    this.socket.on('bid-listener', response => {
      this.getAllBids();

      if (!response['success']) {
        this.notifier.notify('error', response['message']);
      }
    });
  }

  getAllBids() {
    this.auctionService.getAllBidsByAction(this.auction['_id']).subscribe(
      res => {
        if (res['success']) {
          this.bids = res['body'];
        } else {
          this.notifier.notify('error', res['message']);
        }
      }, error => {
        this.notifier.notify('error', 'Something went wrong, please try again!');
      }
    );
  }

  setImage(image) {

    let styles;
    if (image != null) {

      styles = {
        'background': 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%), url(' + constants.main_url + constants.images_path + image + ')',
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

  goBack() {
    this.location.back();
  }

  getAuctionOwner() {

    if (this.auction != null) {
      this.auctionService.getAuctionOwner(this.auction['_id']).subscribe(
        (res) => {
          if (res['success']) {
            this.ownerName = res.body.firstname + ' ' + res.body.lastname;
          } else {
            this.notifier.notify('error', res['message']);
          }
        }, error => {
          this.notifier.notify('error', 'Something went wrong, please try again!');
        }
      );
    }


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
      return this.days + 'D ' + this.hours + 'H ' + this.minutes + 'M  ' + this.seconds + 'S Left';
    } else if (this.days == '0' && this.hours != '0' && this.minutes != '0' && this.seconds != '0') {
      return this.hours + 'H ' + this.minutes + 'M ' + this.seconds + 'S Left';
    } else if (this.days == '0' && this.hours == '0' && this.minutes != '0' && this.seconds != '0') {
      return this.minutes + 'M ' + this.seconds + 'S Left';
    } else {
      return this.seconds + 'S Left';
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.acTimeInterval);
  }

  checkDateIsPassed(dateTime) {
    if (dateTime != null) {
      return moment(dateTime).isBefore();
    }
  }

}
