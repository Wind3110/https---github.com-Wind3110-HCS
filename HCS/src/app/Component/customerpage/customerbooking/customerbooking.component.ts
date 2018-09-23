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
import { DatePipe, getLocaleDateTimeFormat, NgSwitchCase } from '@angular/common';
import * as moment from 'moment';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { messaging } from '../../../../../node_modules/firebase/app';
import { formArrayNameProvider } from '../../../../../node_modules/@angular/forms/src/directives/reactive_directives/form_group_name';
import { SpaceTime } from '../../../Model/TimeModel/StartEndTimeModel/startendtime.model';
import { CheckTime } from '../../../Model/CheckTimeModel/checktime.model';
@Component({
  selector: 'app-customerbooking',
  templateUrl: './customerbooking.component.html',
  styleUrls: ['./customerbooking.component.css']
})
export class CustomerbookingComponent implements OnInit {

  staff: Staff[];
  service: Service[];
  staffList = [];
  serviceList: any[];
  bookList: Booking[];
  bookingList: Booking[];
  bookingForm: FormGroup;
  timer: Time
  date: Date;
  message: string;
  startList: string[];
  endList: string[]
  selectedItems = [];
  spaceTimeList: SpaceTime[];

  checkTime: CheckTime[];


  // checkTimeList: any[] =[{check8h:false},
  // {check8h15:false},
  // {check8h30:false},
  // {"check8h45":false},
  // {"check9h":false},
  // {"check9h15":false},
  // {"check9h30":false},
  // {"check9h45":false},
  // {"check10h":false},
  // {"check10h15":false},
  // {"check10h30":false},
  // {"check10h45":false},
  // {"check11h":false},
  // {"check11h15":false},
  // {"check11h30":false},
  // {"check11h45":false},
  // {"check13h":false},
  // {"check13h15":false},
  // {"check13h30":false},
  // {"check13h45":false},
  // {"check14h":false},
  // {"check14h15":false},
  // {"check14h30":false},
  // {"check14h45":false},
  // {"check15h":false},
  // {"check15h15":false},
  // {"check15h30":false},
  // {"check15h45":false},
  // {"check16h":false},
  // {"check16h15":false},
  // {"check16h30":false},
  // {"check16h45":false},
  // {"check17h":false},
  // {"check17h15":false},
  // {"check17h30":false},
  // {"check17h45":false},
  // {"check18h":false},
  // {"check18h15":false},
  // {"check18h30":false},
  // {"check18h45":false}];

  dropdownServiceSettings = {};
  dropdownStaffSettings = {};

  timeFrame: string[] = ["08:00", "08:15", "08:30", "08:45", "09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30",
    "11:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45",
    "16:00", "16:15", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30", "18:45"];
  timeVal: number[] = [800, 815, 830, 845, 900, 915, 930, 945, 1000, 1015, 1030, 1045, 1100, 1115, 1130,
    1145, 1300, 1315, 1330, 1345, 1400, 1415, 1430, 1445, 1500, 1515, 1530, 1545,
    1600, 1615, 1630, 1645, 1700, 1715, 1730, 1745, 1800, 1815, 1830, 1845];
  timeName: string[] = ["check8h", "check8h15", "check8h30", "check8h45", "check9h", "check9h15", "check9h30", "check9h45", "check10h", "check10h15", "check10h30", "check10h45", "check11h", "check11h15", "check11h30", "check11h45", "check13h", "check13h15", "check13h30", "check13h45", "check14h", "check14h15", "check14h30", "check14h45", "check15h", "check15h15", "check15h30", "check15h45", "check16h", "check16h15", "check16h30", "check16h45", "check17h", "check17h15", "check17h30", "check17h45", "check18h", "check18h15", "check18h30", "check18h45"];
  isDisable: boolean[] = [
    false, false, false, false,false, false, false, false,false, false, false, false,false, false, false, false,false, false, false, false,false, false, false, false,false, false, false, false,false, false, false, false,false, false, false, false,false, false, false, false,
  ];
  time: Time[];


  constructor(config: NgbDatepickerConfig, private staffService: StaffService, private serviceSevice: ServiceService, private bookingService: BookingService, private fb: FormBuilder, private tostr: ToastrService, private datepipe: DatePipe, private modalService: NgbModal) {
    // this.updateTime();
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

      this.staffList.push({ item_id: 1, item_text: 'Mặc định' });
      let i: number = 2;
      this.staff.forEach(item => {
        this.staffList.push({ item_id: i++, item_text: item.FullName });
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
      this.serviceList.push('Mặc định');
    });
  }

  // lay data khi chon ngay
  onChangeDateSelected(dateSelected: any) {
    let dateSelectedList: string[] = JSON.stringify(dateSelected).substring(2, JSON.stringify(dateSelected).length - 1).split(',');
    let fullDateSelected: string = '';
    dateSelectedList.forEach(str => {
      let dateStr: string = str.substring(str.indexOf(':') + 1);
      if (fullDateSelected != '') {
        fullDateSelected = '-' + fullDateSelected;
      }
      fullDateSelected = dateStr + fullDateSelected;
    });

    var z = this.bookingService.getData();
    z.snapshotChanges().subscribe(item => {
      this.bookingList = [];
      item.forEach(element => {
        var s = element.payload.toJSON();
        s["$key"] = element.key;
        this.bookingList.push(s as Booking);
      });
      this.spaceTimeList = [];

      this.bookingList.forEach(item => {
        let tempList: string[] = JSON.stringify(item.Date).substring(2, JSON.stringify(item.Date).length - 1).split(',');
        let fullDate: string = '';
        tempList.forEach(str => {
          let dateStr: string = str.substring(str.indexOf(':') + 1);

          if (fullDate != '') {
            fullDate = fullDate + '-';
          }

          fullDate = fullDate + dateStr;
        });

        let spacetime: SpaceTime = { StartTime: item.StartTime, EndTime: item.EndTime };

        if (fullDateSelected === fullDate) {
          this.spaceTimeList.push(spacetime);
          console.log('checked');
        }
        //  return this.spaceTimeList;
        let mot: number = 1;
        let hai: number = 2;
      });
      console.log(this.spaceTimeList);
      this.isDisabled(this.spaceTimeList);
    });
    // return null;
  }

  // Check to disable time.
  isDisabled(spaceTimeList: SpaceTime[]) {
    spaceTimeList.forEach(element => {
      console.log(element);
      let startTime = element.StartTime.toString();
      console.log("co start");
      let endTime = element.EndTime.toString();
      let startIdex = this.timeFrame.indexOf(startTime);
      let endIdex = this.timeFrame.indexOf(endTime);
      for (startIdex; startIdex < endIdex; startIdex++) {
        this.isDisable[startIdex] = true;
      }

    });

    // this.check8h = false;
    // this.check8h15 = false;
    // this.check8h30 = false;
    // this.check8h45 = false;
    // this.check9h = false;
    // this.check9h15 = false;
    // this.check9h30 = false;
    // this.check9h45 = false;
    // this.check10h = false;
    // this.check10h15 = false;
    // this.check10h30 = false;
    // this.check10h45 = false;
    // this.check11h = false;
    // this.check11h15 = false;
    // this.check11h30 = false;
    // this.check11h45 = false;
    // this.check13h = false;
    // this.check13h15 = false;
    // this.check13h30 = false;
    // this.check13h45 = false;
    // this.check14h = false;
    // this.check14h15 = false;
    // this.check14h30 = false;
    // this.check14h45 = false;
    // this.check15h = false;
    // this.check15h15 = false;
    // this.check15h30 = false;
    // this.check15h45 = false;
    // this.check16h = false;
    // this.check16h15 = false;
    // this.check16h30 = false;
    // this.check16h45 = false;
    // this.check17h = false;
    // this.check17h15 = false;
    // this.check17h30 = false;
    // this.check17h45 = false;
    // this.check18h = false;
    // this.check18h15 = false;
    // this.check18h30 = false;
    // this.check18h45 = false;
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
      bookingForm.value.StartTime = this.getEndTime(timeStr, 0);
      bookingForm.value.EndTime = this.getEndTime(timeStr, totalTime);
    }
    if (bookingForm.value.StaffName === '') {
      bookingForm.value.StaffName = "Mặc định";
    }
    bookingForm.value.StaffName = bookingForm.value.StaffName[0].item_text;
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
      StartTime: null,
      EndTime: null,
    }
  }

  // updateTime() {
  //   this.time = [];
  //   for (let index = 0; index < this.timeFrame.length; index++) {

  //   if(){
  //     this.timer = {
  //       TimeFrame: this.timeFrame[index].toString(),
  //       TimeVal: this.timeVal[index].toString(),
  //       TimeName:this.timeName[index],
  //       isDisable:this.isDisable
  //     }

  //   }

  //     this.time.push(this.timer);
  //     this.timer = null;

  //   }
  // }

  getEndTime(time: string, serviceMin: number) {
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