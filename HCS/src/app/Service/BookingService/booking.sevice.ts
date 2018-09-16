import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Booking } from '../../Model/BookingModel/booking.model';
import { DatePipe } from '@angular/common'

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
    console.log(booking.Date.toString());
    console.log(booking.Time);
    // booking.Time=this.timeFormat(Number(booking.Time));

    

    this.bookList.push({
      CustomerName: booking.CustomerName,
      Gender: booking.Gender,
      Phone:booking.Phone,
      Services: booking.Services,
      StaffName: booking.StaffName,
      Date: booking.Date,
      Time: booking.Time,
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
        Phone:booking.Phone,
        Services: booking.Services,
        StaffName: booking.StaffName,
        Date: booking.Date,
        Time: booking.Time,
      });
  }

  deleteBooking($key: string) {
    this.bookList.remove($key);
  }
}
