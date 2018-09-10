import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {Md5} from 'ts-md5/dist/md5';


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
    console.log(customerForm.value);
    if (customerForm.value.$key == null) {
      console.log("condition 1");
      console.log(customerForm.value.Password);
      customerForm.value.Password=this.encryptMD5(customerForm.value.Password);
      console.log(customerForm.value.Password);
      this.customerService.insertCustomer(customerForm.value);
      console.log("done 1");
    }
    else
    console.log("condition 2");
      this.customerService.updateCustomer(customerForm.value);
    this.resetForm(customerForm);
    this.tostr.success('Submitted Succcessfully', 'Added Service ');

    // ngay khúc này reload lại datatable nè
  }

  encryptMD5(oldPassword : string){
    return Md5.hashStr(oldPassword).toString();
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
      Password:'',
      ConfirmPassword: '',
      Address:''
    }
  }
}
