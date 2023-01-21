import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {constants} from '../constants/constant';

@Injectable()
export class AuctionService {

  constructor(private http: HttpClient) {
  }

  getAuctionsForDashboard():Observable<any>{
    return this.http.get(constants.main_url + constants.auction_path);
  }

}
