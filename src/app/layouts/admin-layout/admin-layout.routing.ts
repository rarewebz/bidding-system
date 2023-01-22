import {Routes} from '@angular/router';

import {DashboardComponent} from '../../pages/dashboard/dashboard.component';
import {IconsComponent} from '../../pages/icons/icons.component';
import {AuctionComponent} from '../../pages/auction/auction.component';
import {UserProfileComponent} from '../../pages/user-profile/user-profile.component';
import {TablesComponent} from '../../pages/tables/tables.component';
import {AuctionCreateComponent} from '../../pages/create-auction/auction-create.component';
import {AuthGuard} from '../../guards/auth.guard';
import {MyAuctionComponent} from '../../pages/my-auction/my-auction.component';

export const AdminLayoutRoutes: Routes = [
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard]},
  {path: 'auction', component: AuctionComponent, canActivate: [AuthGuard]},
  {path: 'auction-create', component: AuctionCreateComponent, canActivate: [AuthGuard]},
  {path: 'my-auction', component: MyAuctionComponent, canActivate: [AuthGuard]}
];
