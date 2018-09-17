import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DlDateTimePickerDateModule } from 'angular-bootstrap-datetimepicker';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Service } from '../../../Model/ServiceModel/service.model';
import { ServiceService } from '../../../Service/SerService/service.service';

import { StaffService } from '../../../Service/StaffService/staff.service'
import { Staff } from '../../../Model/StaffModel/staff.model';
import { Booking } from '../../../Model/BookingModel/booking.model';
import { BookingService } from '../../../Service/BookingService/booking.sevice'


@Component({
  selector: 'app-memberbooking',
  templateUrl: './memberbooking.component.html',
  styleUrls: ['./memberbooking.component.css']
})
export class MemberbookingComponent implements OnInit {

  staff: Staff[];
  service: Service[];
  staffList: any[];
  serviceList: any[];
  bookList: Booking[];
  bookingForm: FormGroup;
  message: string;
  CustomerName: string;

  dropdownServiceSettings = {};
  dropdownStaffSettings = {};

  constructor(config: NgbDatepickerConfig, private staffService: StaffService, private serviceSevice: ServiceService, private bookingService: BookingService, private fb: FormBuilder, private tostr: ToastrService, private modalService: NgbModal) {

    // Seting disable the past date
    const currentDate = new Date();
    config.minDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    // config.maxDate = {year:currentDate.getFullYear(), month: currentDate.getMonth()+1, day: currentDate.getDate()+7};
    config.outsideDays = 'hidden';
  }

  ngOnInit() {



    // Mutiple select service (ng-mutiselect-dropdown)
    this.dropdownServiceSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 20,
      maxHeight: 200,
      // allowSearchFilter: true
    };

    this.dropdownStaffSettings = {
      singleSelection: true,
      allowSearchFilter: true,
      maxHeight: 200,
    };

    this.showCustomerInfo();

    // this.resetForm();
    var x = this.bookingService.getData();
    x.snapshotChanges().subscribe(item => {
      this.bookList = [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        this.bookList.push(y as Booking);
      });
    });

    var x = this.staffService.getData();
    x.snapshotChanges().subscribe(item => {
      this.staff = [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        this.staff.push(y as Staff);

      });

      //push staff name to staffList
      this.staffList = [];
      this.staff.forEach(item => {
        this.staffList.push(item.FullName);
      });
      this.staffList.push('Mặc định');
      console.log(this.staffList)
    });

    var z = this.serviceSevice.getData();
    z.snapshotChanges().subscribe(item => {
      this.service = [];
      item.forEach(element => {
        var s = element.payload.toJSON();
        s["$key"] = element.key;
        this.service.push(s as Service);
      });

      //push service name to serviceList
      this.serviceList = [];
      this.service.forEach(item => {
        this.serviceList.push(item.ServiceName);
      });
    });

    // this.bookingForm = this.fb.group({
    //   staffControl: [''],
    //   serviceControl: ['']
    // });
  }


  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  onSubmit(bookingForm: NgForm) {
    console.log(bookingForm.value.StaffName);
    if (bookingForm.value.StaffName === '') {
      bookingForm.value.StaffName = "Mặc định";
    }
    console.log(bookingForm.value.StaffName);
    this.bookingService.insertBooking(bookingForm.value);
    this.resetForm(bookingForm);
    this.tostr.success('Đặt thành công', "Cảm ơn quý khách");
    this.message = "Quý khách lưu ý đến đúng giờ, trễ 15 phút sẽ bị huỷ. Xin cảm ơn.....";
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true });
  }

  showCustomerInfo(bookingForm?: NgForm) {
    if (bookingForm == null) {
      this.bookingService.selectedBooking.CustomerName = "doan";
      this.bookingService.selectedBooking.Gender = "Nam";
    }
  }

  resetForm(bookingForm?: NgForm) {
    if (bookingForm != null) {
      bookingForm.reset();
    }
    this.bookingService.selectedBooking = {
      $key: null,
      CustomerName: '',
      Gender: '',
      Phone: '',
      Services: [],
      StaffName: '',
      Date: null,
      StartTime: '',
      EndTime:''
    }
  }
}
