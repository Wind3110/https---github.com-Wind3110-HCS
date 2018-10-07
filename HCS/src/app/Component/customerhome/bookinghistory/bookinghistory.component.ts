import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Booking } from '../../../Model/BookingModel/booking.model';
import { BookingService } from '../../../Service/BookingService/booking.sevice';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-bookinghistory',
  templateUrl: './bookinghistory.component.html',
  styleUrls: ['./bookinghistory.component.css']
})
export class BookinghistoryComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  bookingList: Booking[];
  bookingMemberList: Booking[];
  
  objectValue = Object.values;

  constructor(private BookingService: BookingService, private tostr: ToastrService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.dtOptions = {
      retrieve: true,
      // processing: true,
      // scrollX: true,
      language: {
        searchPlaceholder: "Tìm"
      },
    }

    this.resetForm();
    var x = this.BookingService.getData();
    x.snapshotChanges().subscribe(item => {
      this.bookingList = [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        this.bookingList.push(y as Booking);
      });

      this.bookingMemberList = [];
      this.bookingList.forEach(record => {
        if (record.CustomerName === localStorage.getItem('token')) {
          this.bookingMemberList.push(record);
          this.dtTrigger.next();
        }
      })

    });
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  openDetail(contentDetail) {
    this.modalService.open(contentDetail, { size: 'lg' });
  }

  onSubmit(bookingForm: NgForm) {
    this.BookingService.insertBooking(bookingForm.value);
    this.resetForm(bookingForm);
    this.tostr.success('Submitted Succcessfully', 'Staff Register');
  }

  resetForm(bookingForm?: NgForm) {
    if (bookingForm != null)
      bookingForm.reset();
    this.BookingService.selectedBooking = {
      $key: '',
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

  onEdit(booking: Booking) {
    this.BookingService.selectedBooking = Object.assign({}, booking);
  }

  onDelete(key: string) {
    if (confirm('Are you sure to delete this record ?') == true) {
      this.BookingService.deleteBooking(key);
      this.tostr.warning("Deleted Successfully", "Added Customer");
    }
  }
}
