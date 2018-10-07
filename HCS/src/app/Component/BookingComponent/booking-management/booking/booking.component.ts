import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Md5 } from 'ts-md5/dist/md5';


import { BookingService } from '../../../../Service/BookingService/booking.sevice';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  constructor(private bookingService: BookingService, private tostr: ToastrService, private modalService: NgbModal) { }

  ngOnInit() {
  }

  open(content) {
    this.resetForm();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSubmit(bookingForm: NgForm) {
    this.bookingService.insertBooking(bookingForm.value);
    this.resetForm(bookingForm);
    this.tostr.success('Submitted Succcessfully', 'Added Service ');

    // ngay khúc này reload lại datatable nè
  }

  resetForm(customerForm?: NgForm) {
    if (customerForm != null)
      customerForm.reset();
    this.bookingService.selectedBooking = {
      $key: '',
      CustomerName: '',
      Gender: '',
      Phone: '',
      Services: [],
      StaffName: '',
      Date: null,
      StartTime: null,
      EndTime: null,
      Status:null
    }
  }
}
