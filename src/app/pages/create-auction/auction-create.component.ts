import {Component, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {PerfectScrollbarComponent} from 'ngx-perfect-scrollbar';
import {NgbCalendar, NgbDate, NgbDateStruct, NgbInputDatepickerConfig, NgbTimepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NotifierService} from 'angular-notifier';
import {AuctionService} from '../../services/auction.service';
import {Router} from '@angular/router';

declare const google: any;

@Component({
  selector: 'app-auction',
  templateUrl: './auction-create.component.html',
  styleUrls: ['./auction-create.component.scss']
})
export class AuctionCreateComponent implements OnInit {

  days;
  hours;
  minutes;
  seconds;

  remTime: string;

  images: any = [];

  savedAuctionId: any;

  @ViewChild(PerfectScrollbarComponent, {static: true})
  scrollbar?: PerfectScrollbarComponent;

  auctionFrom = new FormGroup({
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    startTime: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    initialPrice: new FormControl('', [Validators.required]),
  });


  constructor(config: NgbTimepickerConfig, configDate: NgbInputDatepickerConfig, calendar: NgbCalendar, private notifier: NotifierService, private auctionService: AuctionService,private router:Router) {
    config.seconds = true;
    config.spinners = false;

  }

  ngOnInit() {

  }


  goBack() {
    this.router.navigate(['dashboard']);
  }

  saveAuction() {

    let sd = this.auctionFrom.controls.startDate.value;
    let st = this.auctionFrom.controls.startTime.value;

    let ed = this.auctionFrom.controls.endDate.value;
    let et = this.auctionFrom.controls.endTime.value;

    if (this.auctionFrom.valid) {

      let req = {
        name: this.auctionFrom.controls.name.value,
        initialprice: this.auctionFrom.controls.initialPrice.value,
        startdate: sd['year'] + '-' + sd['month'] + '-' + sd['day'] + ' ' + st['hour'] + ':' + st['minute'] + ':' + st['second'],
        enddate: ed['year'] + '-' + ed['month'] + '-' + ed['day'] + ' ' + et['hour'] + ':' + et['minute'] + ':' + et['second'],
        description: this.auctionFrom.controls.description.value,
      };

      this.auctionService.saveAuction(req).subscribe(
        res => {
          if (res['success']) {

            this.savedAuctionId = res['body']['auction']['_id'];

            let reqImages = {
              images: this.images
            };

            this.auctionService.saveAuctionImage(this.savedAuctionId, reqImages).subscribe(
              res => {
                if (res['success']) {
                  this.notifier.notify('success', 'Your action has been successfully saved!');
                } else {
                  this.notifier.notify('error', res['message']);
                }
              }
            );

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


  onFileChange(event: any) {

    if (this.images.length <= 2) {

      if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
          var reader = new FileReader();

          reader.onload = (event: any) => {
            this.images.push(event.target.result);

            this.auctionFrom.patchValue({
              fileSource: this.images
            });
          };

          reader.readAsDataURL(event.target.files[i]);
        }
      }
    } else {
      this.notifier.notify('warning', 'Sorry, you can only choose 3 images');
    }
  }

}
