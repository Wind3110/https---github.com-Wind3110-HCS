import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './service/AuthService/auth.guard';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartComponent } from './Component/chart/chart.component';
import { LoginComponent } from './Component/login/login.component';
import { StaffManagementComponent } from '../app/Component/StaffComponent/staff-management/staff-management.component';
import { StaffComponent } from '../app/Component/StaffComponent/staff-management/staff/staff.component';
import { StaffListComponent } from '../app/Component/StaffComponent/staff-management/staff-list/staff-list.component';
import { ServiceManagementComponent } from './Component/ServiceComponent/service-management/service-management.component';
import { ServiceComponent } from './Component/ServiceComponent/service-management/service/service.component';
import { ServiceListComponent } from './Component/ServiceComponent/service-management/service-list/service-list.component';
import { CustomerManagementComponent } from './Component/CustomerComponent/customer-management/customer-management.component';
import { CustomerComponent } from './Component/CustomerComponent/customer-management/customer/customer.component';
import { CustomerListComponent } from './Component/CustomerComponent/customer-management/customer-list/customer-list.component';
import { BookingformComponent } from './Component/bookingform/bookingform.component';
import { DashboardComponent } from './Component/DashboardComponent/dashboard/dashboard.component';
import { CustomerpageComponent } from './Component/customerpage/customerpage.component';
import { CustomerregistrationComponent } from './Component/customerpage/customerregistration/customerregistration.component';
import { CustomerloginComponent } from './Component/customerpage/customerlogin/customerlogin.component';
import { CustomerbookingComponent } from './Component/customerpage/customerbooking/customerbooking.component';
import { CompareValidatorDirective } from './shared/compare-validator.directive';
import { CustomerhomeComponent } from './Component/customerhome/customerhome.component';

const routes: Routes = [

  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
      { path: 'staff', component: StaffManagementComponent },
      { path: 'booking', component: BookingformComponent },
      { path: 'service', component: ServiceManagementComponent },
      { path: 'customer', component: CustomerManagementComponent },
      { path: 'chart', component: ChartComponent },
    ]
  },

  {
    path: 'homepage', component: CustomerpageComponent, children: [
      { path: 'customerregistration', component: CustomerregistrationComponent },
      { path: 'customerlogin', component: CustomerloginComponent },
      { path: 'customerbooking', component: CustomerbookingComponent },
    ]
  },

  {
    path: 'customerhome', component: CustomerhomeComponent, canActivate: [AuthGuard], children: [
      { path: 'customerregistration', component: CustomerregistrationComponent },
      { path: 'customerlogin', component: CustomerloginComponent },
      { path: 'customerbooking', component: CustomerbookingComponent },
    ]
  },

  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/homepage', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
