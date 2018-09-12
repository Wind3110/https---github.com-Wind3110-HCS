import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Booking } from '../../Model/BookingModel/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  bookList: AngularFireList<any>;
  selectedCustomer: Booking = new Booking();
  constructor(private firebase: AngularFireDatabase) { }

  getData() {
    this.bookList = this.firebase.list('HCS_Booking_Form');
    return this.bookList;
  }

  insertBooking(booking: Booking) {
    console.log(" enter insertCustomer")
    console.log(this.bookList)
    this.bookList.push({
      CustomerName: booking.CustomerName,
      Gender: booking.Gender,
      Services: booking.Services,
      StaffName: booking.StaffName,
      Date: booking.Date,
      Time: booking.Time,
    });
  }

  updateBooking(booking: Booking) {
    this.bookList.update(booking.$key,
      {
        CustomerName: booking.CustomerName,
        Gender: booking.Gender,
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
