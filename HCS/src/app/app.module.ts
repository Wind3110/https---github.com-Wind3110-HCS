import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AuthGuard } from './service/AuthService/auth.guard';

// Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { StaffManagementComponent } from '../app/Component/StaffComponent/staff-management/staff-management.component';
import { StaffComponent } from '../app/Component/StaffComponent/staff-management/staff/staff.component';
import { StaffListComponent } from '../app/Component/StaffComponent/staff-management/staff-list/staff-list.component';


// Font-awesome
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AppRoutingModule } from './app-routing.module';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'

// Datatable
import { DataTablesModule } from 'angular-datatables';
import { DataTableModule } from "angular-6-datatable";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartComponent } from './Component/chart/chart.component';
import { LoginComponent } from './Component/login/login.component';
import { ServiceManagementComponent } from './Component/ServiceComponent/service-management/service-management.component';
import { ServiceComponent } from './Component/ServiceComponent/service-management/service/service.component';
import { ServiceListComponent } from './Component/ServiceComponent/service-management/service-list/service-list.component';
import { CustomerManagementComponent } from './Component/CustomerComponent/customer-management/customer-management.component';
import { CustomerComponent } from './Component/CustomerComponent/customer-management/customer/customer.component';
import { CustomerListComponent } from './Component/CustomerComponent/customer-management/customer-list/customer-list.component';
import { BookingformComponent } from './Component/bookingform/bookingform.component';
import { DashboardComponent } from './Component/DashboardComponent/dashboard/dashboard.component';

// const childroutes: Routes = [

//   {
//     path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
//       { path: 'management', outlet: 'admin', component: StaffManagementComponent,pathMatch: 'full' },
//       { path: 'staffupdate', outlet: 'admin', component: StaffComponent,pathMatch: 'full'},
//       { path: 'sermanagement', outlet: 'admin', component: ServiceManagementComponent,pathMatch: 'full' },
//       { path: 'stafftable', outlet: 'admin', component: StaffListComponent,pathMatch: 'full' },
//       { path: 'chart', outlet: 'admin', component: ChartComponent,pathMatch: 'full' },
//     ]
//   },
// ];

const routes: Routes = [

  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
      { path: 'management', component: StaffManagementComponent },
      { path: 'booking', component: BookingformComponent },
      { path: 'staffupdate', component: StaffComponent },
      { path: 'sermanagement', component: ServiceManagementComponent },
      { path: 'customermanagement', component: CustomerManagementComponent },
      { path: 'stafftable', component: StaffListComponent },
      { path: 'chart', component: ChartComponent },
    ]
  },

  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    StaffManagementComponent,
    StaffComponent,
    StaffListComponent,
    ChartComponent,
    LoginComponent,
    ServiceManagementComponent,
    ServiceComponent,
    ServiceListComponent,
    CustomerManagementComponent,
    CustomerComponent,
    CustomerListComponent,
    BookingformComponent,
    DashboardComponent,
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ToastrModule.forRoot(),
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    AngularFontAwesomeModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    DataTablesModule,
    DataTableModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})

export class AppModule { }
