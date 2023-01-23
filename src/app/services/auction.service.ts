import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {constants} from '../constants/constant';

@Injectable()
export class AuctionService {

  constructor(private http: HttpClient) {
  }

  getAuctionsForDashboard(): Observable<any> {
    return this.http.get(constants.main_url + constants.auction_path);
  }

  saveAuction(req): Observable<any> {
    return this.http.post(constants.main_url + constants.auction_path, req);
  }

  saveAuctionImage(auctionId, req): Observable<any> {
    return this.http.post(constants.main_url + constants.auction_image_path + '/' + auctionId, req);
  }

  getMyAuctions(): Observable<any> {
    return this.http.get(constants.main_url + constants.my_auction_path);
  }

  getAuctionOwner(userId) : Observable<any>{
    return this.http.get(constants.main_url + constants.auction_path + "/" + userId + "/owner");
  }

  getAllBidsByAction(auctionId): Observable<any>{
    return this.http.get(constants.main_url + constants.auction_path + "/" + auctionId +"/bids");
  }

}
