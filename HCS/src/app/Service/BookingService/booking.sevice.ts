import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Booking } from '../../Model/BookingModel/booking.model';
import { DatePipe } from '@angular/common'
import { Key } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  bookList: AngularFireList<any>;
  selectedBooking: Booking = new Booking();
  constructor(private firebase: AngularFireDatabase) { }

  getData() {
    this.bookList = this.firebase.list('HCS_Booking_Form');
    return this.bookList;
  }

  insertBooking(booking: Booking) {
    this.bookList.push({
      CustomerName: booking.CustomerName,
      Gender: booking.Gender,
      Phone: booking.Phone,
      Services: booking.Services,
      StaffName: booking.StaffName,
      Date: booking.Date,
      StartTime: booking.StartTime,
      EndTime: booking.EndTime,
    });
  }

  // timeFormat(time:string){
  //   let timeStr : string = time.toString();
  //   let timeStandard:Time;
  //   if(timeStr.length!=3&&timeStr.length!=4){
  //     return null;
  //   }
  //   if(timeStr.length==3){
  //     console.log(timeStr);
  //     let hour : number = Number(timeStr.substring(1,1));
  //     let min : number = Number(timeStr.substring(2,2));
  //     console.log(hour);
  //     console.log(min);
  //     timeStandard.hours=hour;
  //     timeStandard.minutes=min;
  //   }
  //   if(timeStr.length==4){
  //     let hour : number = Number(timeStr.substring(1,2));
  //     let min : number = Number(timeStr.substring(2,2));
  //     timeStandard.=hour;
  //     timeStandard.minutes=min;
  //   }
  //   return timeStandard;
  // }

  updateBooking(booking: Booking) {
    this.bookList.update(booking.$key,
      {
        CustomerName: booking.CustomerName,
        Gender: booking.Gender,
        Phone: booking.Phone,
        Services: booking.Services,
        StaffName: booking.StaffName,
        Date: booking.Date,
        StartTime: booking.StartTime,
        EndTime: booking.EndTime,
      });
  }

  deleteBooking($key: string) {
    this.bookList.remove($key);
  }
}
