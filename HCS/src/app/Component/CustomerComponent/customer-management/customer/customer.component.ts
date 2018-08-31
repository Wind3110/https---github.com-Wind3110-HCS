import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'

import { CustomerService } from '../../../../Service/CustomerService/customer.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  constructor(private customerService: CustomerService, private tostr: ToastrService, private modalService: NgbModal) { }

  ngOnInit() {
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSubmit(customerForm: NgForm) {
    if (customerForm.value.$key == null)
      this.customerService.insertCustomer(customerForm.value);
    else
      this.customerService.updateCustomer(customerForm.value);
    this.resetForm(customerForm);
    this.tostr.success('Submitted Succcessfully', 'Added Service ');

    // ngay khúc này reload lại datatable nè
  }

  resetForm(customerForm?: NgForm) {
    if (customerForm != null)
    customerForm.reset();
    this.customerService.selectedCustomer = {
      $key: null,
      FullName: '',
      Gender: '',
      PhoneNumber: '',
      Level: '',
      Username:'',
      Password:''
    }
  }
}
