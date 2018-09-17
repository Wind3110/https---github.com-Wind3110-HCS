import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DlDateTimePickerDateModule } from 'angular-bootstrap-datetimepicker';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Service } from '../../../Model/ServiceModel/service.model';
import { ServiceService } from '../../../Service/SerService/service.service';

import { StaffService } from '../../../Service/StaffService/staff.service'
import { Staff } from '../../../Model/StaffModel/staff.model';
import { Booking } from '../../../Model/BookingModel/booking.model';
import { BookingService } from '../../../Service/BookingService/booking.sevice';
import { Time } from '../../../Model/TimeModel/time.model';
import { DatePipe, getLocaleDateTimeFormat } from '@angular/common';
import * as moment from 'moment';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { messaging } from '../../../../../node_modules/firebase/app';
import { formArrayNameProvider } from '../../../../../node_modules/@angular/forms/src/directives/reactive_directives/form_group_name';

@Component({
  selector: 'app-customerbooking',
  templateUrl: './customerbooking.component.html',
  styleUrls: ['./customerbooking.component.css']
})
export class CustomerbookingComponent implements OnInit {

  staff: Staff[];
  service: Service[];
  staffList: any[];
  serviceList: any[];
  bookList: Booking[];
  bookingForm: FormGroup;
  timer: Time
  date: Date;
  message: string;
  

  check8h: boolean = false;
  check8h30: boolean = false;
  check9h: boolean = false;
  check9h30: boolean = false;
  check10h: boolean = false;
  check10h30: boolean = false;
  check11h: boolean = false;
  check11h30: boolean = false;
  check13h: boolean = false;
  check13h30: boolean = false;
  check14h: boolean = false;
  check14h30: boolean = false;
  check15h: boolean = false;
  check15h30: boolean = false;
  check16h: boolean = false;
  check16h30: boolean = false;
  check17h: boolean = false;
  check17h30: boolean = false;
  check18h: boolean = false;
  check18h30: boolean = false;

  dropdownServiceSettings = {};
  dropdownStaffSettings = {};

  timeFrame: string[] = ["8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
    "20:00", "20:30", "21:00"];
  timeVal: string[] = ["800", "830", "900", "930", "1000", "1030", "1100", "1130",
    "1200", "1230", "1300", "1330", "1400", "1430", "1500", "1530",
    "1600", "1630", "1700", "1730", "1800", "1830", "1900", "1930",
    "2000", "2030", "2100"];

  time: Time[];


  constructor(config: NgbDatepickerConfig, private staffService: StaffService, private serviceSevice: ServiceService, private bookingService: BookingService, private fb: FormBuilder, private tostr: ToastrService, private datepipe: DatePipe, private modalService: NgbModal) {
    this.updateTime();

    // this.myFunction();
    // Seting disable the past date
    const currentDate = new Date();
    config.minDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    // config.maxDate = {year:currentDate.getFullYear(), month: currentDate.getMonth()+1, day: currentDate.getDate()+7};
    config.outsideDays = 'hidden';
  }

  ngOnInit() {

    this.isDisabled();
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

    this.resetForm();
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
      this.serviceList.push('Mặc định')
    });

    // this.bookingForm = this.fb.group({
    //   staffControl: [''],
    //   serviceControl: ['']
    // });
  }

  isDisabled() {
    this.check8h = true;
    this.check8h30 = false;
    this.check9h = false;
    this.check9h30 = true;
    this.check10h = false;
    this.check10h30 = false;
    this.check11h = false;
    this.check11h30 = false;
    this.check13h = false;
    this.check13h30 = true;
    this.check14h = false;
    this.check14h30 = false;
    this.check15h = false;
    this.check15h30 = false;
    this.check16h = false;
    this.check16h30 = true;
    this.check17h = false;
    this.check17h30 = false;
    this.check18h = false;
    this.check18h30 = true;
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  onSubmit(bookingForm: NgForm) {
    console.log(bookingForm.value);
    let countService: number = 0;
    let totalTime: number = 30;
    let dateStr: string = bookingForm.value.Date.toString();
    let timeStr: string = bookingForm.value.StartTime.toString();
    for (let index = 0; index < bookingForm.value.Services.length; index++) {
      countService++;
    }

    if (countService > 1) {
      totalTime = totalTime * countService;
      console.log(totalTime);
      bookingForm.value.StartTime = this.myFunction(timeStr, 0);
      console.log('StartTime:' + bookingForm.value.StartTime);
      bookingForm.value.EndTime = this.myFunction(timeStr, totalTime);
      console.log('EndTime:' + bookingForm.value.EndTime);
    }
    console.log(bookingForm.value.StaffName);
    if (bookingForm.value.StaffName === '') {
      bookingForm.value.StaffName = "Mặc định";
    }

    this.bookingService.insertBooking(bookingForm.value);
    this.resetForm(bookingForm);
    this.tostr.success('Đặt thành công', "Cảm ơn quý khách");
    this.message = "Quý khách lưu ý đến đúng giờ, trễ 15 phút sẽ bị huỷ. Xin cảm ơn.....";
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true });
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
      EndTime: '',
    }
  }

  updateTime() {
    this.time = [];
    for (let index = 0; index < this.timeFrame.length; index++) {
      this.timer = {
        TimeFrame: this.timeFrame[index].toString(),
        TimeVal: this.timeVal[index].toString()
      }
      this.time.push(this.timer);
      this.timer = null;

    }
  }

  myFunction(time: string, serviceMin: number) {
    moment.locale('vi');
    let now = moment(time, "hmm");
    now = now.add(serviceMin, 'm')
    return now.format("HH:mm").toString();
  }
}


// let timeWorking =  ;
// timeForm;
// if( timeForm > timeWorking) {
//   message = 'gio nay da co nguoi dat';

// }
// message = ''


// let timeWorking
// let startTime = form.value.Time;
// let endTime = totalTime;
// if(startTime > timeWorking ||timeWorking >endTime) {
//   true
// }