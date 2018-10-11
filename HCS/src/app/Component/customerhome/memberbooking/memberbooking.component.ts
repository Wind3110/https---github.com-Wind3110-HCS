import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DlDateTimePickerDateModule } from 'angular-bootstrap-datetimepicker';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

import { Service } from '../../../Model/ServiceModel/service.model';
import { ServiceService } from '../../../Service/SerService/service.service';

import { StaffService } from '../../../Service/StaffService/staff.service';
import { CustomerService } from '../../../Service/CustomerService/customer.service';
import { Staff } from '../../../Model/StaffModel/staff.model';
import { Booking } from '../../../Model/BookingModel/booking.model';
import { BookingService } from '../../../Service/BookingService/booking.sevice';
import { Time } from '../../../Model/TimeModel/time.model';
import { DatePipe, getLocaleDateTimeFormat, NgSwitchCase } from '@angular/common';
import * as moment from 'moment';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { messaging } from '../../../../../node_modules/firebase/app';
import { formArrayNameProvider } from '../../../../../node_modules/@angular/forms/src/directives/reactive_directives/form_group_name';
import { SpaceTime } from '../../../Model/TimeModel/StartEndTimeModel/startendtime.model';
import { CheckTime } from '../../../Model/CheckTimeModel/checktime.model';
import { ServiceView } from '../../../Model/ServiceModel/serviceview.model';
import { Customer } from '../../../Model/CustomerModel/customer.model';

@Component({
  selector: 'app-memberbooking',
  templateUrl: './memberbooking.component.html',
  styleUrls: ['./memberbooking.component.css']
})
export class MemberbookingComponent implements OnInit {

  staff: Staff[];
  service: Service[];
  staffList = [];
  serviceList: ServiceView[];
  serviceNameList: any[];
  bookList: Booking[];
  bookingList: Booking[];
  customerList: Customer[];
  bookingForm: FormGroup;
  myGroup: FormGroup;
  timer: Time;
  date: Date;
  message: string;
  startList: string[];
  endList: string[];
  selectedItems = [];
  spaceTimeList: SpaceTime[];
  checkTime: CheckTime[];
  returnUrl: string;
  checkValidTimeBook: boolean = true;
  submitted = false;
  spaceTimeListOfStaff: SpaceTime[];

  dropdownServiceSettings = {};
  dropdownStaffSettings = {};

  timeFrame: string[] = ['08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15',
    '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15',
    '13:00', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45',
    '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00'];
  timeVal: number[] = [800, 815, 830, 845, 900, 915, 930, 945, 1000, 1015, 1030, 1045, 1100, 1115, 1130,
    1145, 1200, 1215, 1230, 1245, 1300, 1315, 1330, 1345, 1400, 1415, 1430, 1445, 1500, 1515, 1530, 1545,
    1600, 1615, 1630, 1645, 1700, 1715, 1730, 1745, 1800, 1815, 1830, 1845, 1900];
  timeName: string[] = ['check8h', 'check8h15', 'check8h30', 'check8h45', 'check9h', 'check9h15', 'check9h30',
    'check9h45', 'check10h', 'check10h15', 'check10h30', 'check10h45', 'check11h', 'check11h15', 'check11h30',
    'check11h45', 'check12h', 'check12h15', 'check12h30', 'check12h45', 'check13h', 'check13h15', 'check13h30',
    'check13h45', 'check14h', 'check14h15', 'check14h30', 'check14h45', 'check15h', 'check15h15', 'check15h30',
    'check15h45', 'check16h', 'check16h15', 'check16h30', 'check16h45', 'check17h', 'check17h15', 'check17h30',
    'check17h45', 'check18h', 'check18h15', 'check18h30', 'check18h45', 'check19h'];
  isDisable: boolean[] = [
    false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false, false, false
  ];
  isEnabledAll: boolean[] = [
    false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false, false, false
  ];

  time: Time[];

  constructor(config: NgbDatepickerConfig, private staffService: StaffService, private serviceSevice: ServiceService,
    private bookingService: BookingService, private fb: FormBuilder, private customerService: CustomerService,
    private tostr: ToastrService, private datepipe: DatePipe, private modalService: NgbModal, private router: Router,
    private formBuilder: FormBuilder) {

    this.updateTime();

    // Seting disable the past date
    const currentDate = new Date();
    config.minDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    // config.maxDate = {year:currentDate.getFullYear(), month: currentDate.getMonth()+1, day: currentDate.getDate()+7};
    config.outsideDays = 'hidden';
  }

  ngOnInit() {

    this.resetForm();
    // Return to home page when submit succsess
    this.returnUrl = '/customerhome';
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
    this.selectedItems = [
      { item_id: 1, item_text: 'Mặc định' },
    ];


    this.dropdownStaffSettings = {
      idField: 'item_id',
      textField: 'item_text',
      singleSelection: true,
      allowSearchFilter: true,
      maxHeight: 200,
    };

    const a = this.customerService.getData();
    a.snapshotChanges().subscribe(item => {
      this.customerList = [];
      item.forEach(element => {
        const b = element.payload.toJSON();
        b['$key'] = element.key;
        this.customerList.push(b as Customer);
      });

      // Show memeber info on booking form
      if (this.bookingForm == null) {
        this.bookingService.selectedBooking.CustomerName = localStorage.getItem('token');
        this.customerList.forEach(element => {
          if (element.Username === localStorage.getItem('token')) {
            this.bookingService.selectedBooking.Gender = element.Gender;
            this.bookingService.selectedBooking.Phone = element.PhoneNumber;
          }
        });
        console.log(localStorage.getItem('token'));
      }
    });

    const c = this.bookingService.getData();
    c.snapshotChanges().subscribe(item => {
      this.bookList = [];
      item.forEach(element => {
        const d = element.payload.toJSON();
        d['$key'] = element.key;
        this.bookList.push(d as Booking);
      });
    });

    const e = this.staffService.getData();
    e.snapshotChanges().subscribe(item => {
      this.staff = [];
      item.forEach(element => {
        const f = element.payload.toJSON();
        f['$key'] = element.key;
        this.staff.push(f as Staff);
      });
      // push staff name to staffList
      this.staffList = [];
      this.staffList.push({ item_id: 1, item_text: 'Mặc định' });
      let i = 2;
      this.staff.forEach(item => {
        this.staffList.push({ item_id: i++, item_text: item.FullName });
      });
    });

    const z = this.serviceSevice.getData();
    z.snapshotChanges().subscribe(item => {
      this.service = [];
      item.forEach(element => {
        const s = element.payload.toJSON();
        s['$key'] = element.key;
        this.service.push(s as Service);
      });

      // push service name to serviceList
      this.serviceList = [];
      this.serviceNameList = [];
      this.service.forEach(item => {
        const newItem: ServiceView = { ServiceName: item.ServiceName, TimeUnit: item.TimeUnit };
        this.serviceList.push(newItem);
        this.serviceNameList.push(item.ServiceName);
      });
    });
  }

  // lay data khi chon ngay
  onChangeDateSelected(dateSelected: any) {
    // console.log(dateSelected);
    const dateSelectedList: string[] = JSON.stringify(dateSelected).substring(2, JSON.stringify(dateSelected).length - 1).split(',');
    let fullDateSelected = '';
    dateSelectedList.forEach(str => {
      const dateStr: string = str.substring(str.indexOf(':') + 1);
      if (fullDateSelected !== '') {
        fullDateSelected = '-' + fullDateSelected;
      }
      fullDateSelected = dateStr + fullDateSelected;
    });

    const z = this.bookingService.getData();
    z.snapshotChanges().subscribe(item => {
      this.bookingList = [];
      item.forEach(element => {
        const s = element.payload.toJSON();
        s['$key'] = element.key;
        this.bookingList.push(s as Booking);
      });
      this.spaceTimeList = [];

      this.bookingList.forEach(item => {
        const tempList: string[] = JSON.stringify(item.Date).substring(2, JSON.stringify(item.Date).length - 1).split(',');
        let fullDate = '';
        tempList.forEach(str => {
          const dateStr: string = str.substring(str.indexOf(':') + 1);

          if (fullDate !== '') {
            fullDate = fullDate + '-';
          }

          fullDate = fullDate + dateStr;
        });

        const spacetime: SpaceTime = { StartTime: item.StartTime, EndTime: item.EndTime };

        if (fullDateSelected === fullDate) {
          this.spaceTimeList.push(spacetime);
          console.log('checked');
        }
      });
      const datePick = dateSelected.day + '-' + dateSelected.month + '-' + dateSelected.year;
      console.log(datePick);
      this.isDisablePastTime(datePick);
      this.isDisableTimeBooked(this.spaceTimeList);
      this.updateTime();
    });
  }

  // Check disable time.
  isDisableTimeBooked(spaceTimeList: SpaceTime[]) {
    // Check disable time which is booked
    spaceTimeList.forEach(element => {
      const startTime = element.StartTime.toString();
      const endTime = element.EndTime.toString();
      let startIdex = this.timeFrame.indexOf(startTime);
      const endIdex = this.timeFrame.indexOf(endTime);
      for (startIdex; startIdex < endIdex; startIdex++) {
        this.isDisable[startIdex] = true;
      }
    });
  }

  // Check disable time < current
  isDisablePastTime(datePick: string) {
    for (let i = 0; i < this.timeFrame.length; i++) {
      const beginCheckTime = moment(datePick + ' ' + this.timeFrame[i], 'DD-MM-YYYY HH:mm');
      console.log(beginCheckTime);
      const endTimeCheck = moment(this.getCurrentTime(), 'DD-MM-YYYY HH:mm');
      console.log(beginCheckTime.isBefore(endTimeCheck));
      if (beginCheckTime.isBefore(endTimeCheck)) {
        this.isDisable[i] = true;
      } else {
        this.isDisable[i] = false;
      }
    }
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }


  assignServiceForStaff(dateSelected: any, employeeList: Staff[], bookingFormList: Booking[]) {
    // console.log(dateSelected);
    var staffNameTemp = [];
    var tempStaffArray = [];
    var tempTimeNumberArr = [];
    this.spaceTimeListOfStaff = [];
    var variables = [];
    let numberTemp = 0;

    employeeList.forEach(element => {
      staffNameTemp.push(element.FullName);
      variables.push(0);
    });

    // console.log(staffNameTemp);
    // console.log(variables);

    employeeList.forEach(item => {
      bookingFormList.forEach(element => {
        if (item.FullName === element.StaffName) {

          let dateSelectedList: string[] = JSON.stringify(element.Date).substring(2, JSON.stringify(element.Date).length - 1).split(',');
          let fullDateSelected = '';
          dateSelectedList.forEach(str => {
            let dateStr: string = str.substring(str.indexOf(':') + 1);
            if (fullDateSelected !== '') {
              fullDateSelected = '-' + fullDateSelected;
            }
            fullDateSelected = dateStr + fullDateSelected;
          });

          let dateSelectedList2: string[] = JSON.stringify(dateSelected).substring(2, JSON.stringify(dateSelected).length - 1).split(',');
          let fullDateSelected2 = '';
          dateSelectedList.forEach(str => {
            let dateStr2: string = str.substring(str.indexOf(':') + 1);
            if (fullDateSelected2 !== '') {
              fullDateSelected2 = '-' + fullDateSelected2;
            }
            fullDateSelected2 = dateStr2 + fullDateSelected2;
          });

          if (fullDateSelected === fullDateSelected2) {

            let spaceTimeOfStaff: SpaceTime = { StartTime: element.StartTime, EndTime: element.EndTime };


            this.spaceTimeListOfStaff.push(spaceTimeOfStaff);

            //Get number time worked of staff
            let j = 0;
            this.spaceTimeListOfStaff.forEach(element => {
              let startTime = element.StartTime.toString();
              let endTime = element.EndTime.toString();
              let startIdex = this.timeFrame.indexOf(startTime);
              let endIdex = this.timeFrame.indexOf(endTime);
              for (startIdex; startIdex < endIdex; startIdex++) {
                j = j + 1;
              }
            });
            // console.log(j);
            let indexOfStaff = staffNameTemp.indexOf(element.StaffName);
            variables[indexOfStaff] = variables[indexOfStaff] + j;


          }
        }
      });
    })
    // console.log(staffNameTemp);
    // console.log(variables);
    let tempval = variables[0];
    let position = 0;
    var equalStaffTimeName = [];
    var equalStaffTimePosition = [];
    for (let index = 0; index < variables.length; index++) {
      if (tempval >= variables[index]) {
        tempval = variables[index];
        position = index;
        equalStaffTimeName = [];
        equalStaffTimePosition = [];
      }
      if (tempval == variables[index]) {
        equalStaffTimeName.push(variables[index]);
        equalStaffTimePosition.push(index);
      }
    }

    if (equalStaffTimeName.length == 0) {
      return staffNameTemp[position];
    }
    else {
      var rand = equalStaffTimePosition[Math.floor(Math.random() * equalStaffTimePosition.length)];
      numberTemp = rand;
      return staffNameTemp[rand];
    }
  }

  // Event on submit booking form
  onSubmit(bookingForm: NgForm) {
    this.submitted = true;
    let countService = 0;
    let dateStr: string = bookingForm.value.Date.toString();
    let timeStr: string = bookingForm.value.StartTime.toString();
    for (let index = 0; index < bookingForm.value.Services.length; index++) {
      this.serviceList.forEach(element => {
        if (element.ServiceName === bookingForm.value.Services[index]) {
          countService = countService + element.TimeUnit;
        }
      });
    }

    if (countService > 1) {
      bookingForm.value.StartTime = this.getTotalTime(timeStr, 0);
      bookingForm.value.EndTime = this.getTotalTime(timeStr, countService);
      let lastIndex = this.timeVal.indexOf(1900) + 1;
      let endTimeIndex = this.timeFrame.indexOf(bookingForm.value.EndTime);
      if (bookingForm.value.EndTime === '19:15') {
        endTimeIndex = -2;
      }
      if (endTimeIndex < lastIndex) {
        this.checkValidTimeBook = true;
      }
      if (endTimeIndex === -1) {
        this.checkValidTimeBook = false;
      }
      if (endTimeIndex === -2) {
        this.checkValidTimeBook = true;
      }
    }

    //check endtime if it overide on another's starttime item
    for (let index = 0; index < this.spaceTimeList.length; index++) {
      const element = this.spaceTimeList[index];
      if (moment(bookingForm.value.StartTime, 'HH:mm').isBefore(moment(element.StartTime, 'HH:mm'))
        && moment(bookingForm.value.EndTime, 'HH:mm').isAfter(moment(element.StartTime, 'HH:mm'))) {
        this.checkValidTimeBook = false;
      }
    }

    if (this.checkValidTimeBook) {
      if (bookingForm.value.StaffName[0].item_text == 'Mặc định') {
        bookingForm.value.StaffName = this.assignServiceForStaff(bookingForm.value.Date, this.staff, this.bookingList);
      }
      else {
        bookingForm.value.StaffName = bookingForm.value.StaffName[0].item_text;
      }
      bookingForm.value.Status = 1;
      this.bookingService.insertBooking(bookingForm.value);
      this.resetForm(bookingForm);
      this.tostr.success('Đặt thành công', 'Cảm ơn quý khách', {
        timeOut: 1000,
        progressBar: true
      });
      this.message = 'Quý khách lưu ý đến đúng giờ, trễ 5 phút sẽ bị huỷ. Xin cảm ơn.....';
      this.router.navigate([this.returnUrl]);

    } else {
      this.message = 'Không thể đặt';
      this.checkValidTimeBook = true;
    }
  }

  // Open popup
  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true });
  }

  // Reset data on form
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
      StartTime: null,
      EndTime: null,
      Status: null
    };
  }

  updateTime() {
    this.time = [];
    for (let index = 0; index < this.timeFrame.length; index++) {
      this.timer = {
        TimeFrame: this.timeFrame[index].toString(),
        TimeVal: this.timeVal[index].toString(),
        TimeName: this.timeName[index],
        isDisable: this.isDisable[index],
      };
      this.time.push(this.timer);
      this.timer = null;

    }
  }

  // Get total time of total services on booking form
  getTotalTime(time: string, serviceMin: number) {
    moment.locale('vi');
    let now = moment(time, 'hmm');
    now = now.add(serviceMin, 'm');
    return now.format('HH:mm').toString();
  }

  // Get current time (hour and minutes)
  getCurrentTime() {
    const current = moment().format('DD-MM-YYYY HH:mm');
    return current;
  }
}
