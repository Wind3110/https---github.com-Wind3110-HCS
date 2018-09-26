import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Customer } from '../../../Model/CustomerModel/customer.model';
import { CustomerService } from '../../../Service/CustomerService/customer.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'app-customerregistration',
  templateUrl: './customerregistration.component.html',
  styleUrls: ['./customerregistration.component.css']
})
export class CustomerregistrationComponent implements OnInit {
  customerList: Customer[];
  returnUrl: string;

  constructor(private customerService: CustomerService, private tostr: ToastrService, private router: Router) { }

  ngOnInit() {
    this.returnUrl = '/homepage/customerlogin';

    this.resetForm();
    const x = this.customerService.getData();
    x.snapshotChanges().subscribe(item => {
      this.customerList = [];
      item.forEach(element => {
        const y = element.payload.toJSON();
        y['$key'] = element.key;
        this.customerList.push(y as Customer);
      });
    });
  }


  onSubmit(customerRegistrationForm: NgForm) {
    customerRegistrationForm.value.Password = this.encryptMD5(customerRegistrationForm.value.Password);
    this.customerService.insertCustomer(customerRegistrationForm.value);
    this.tostr.success('Đăng ký thành công', 'Đăng ký tài khoản');
    this.resetForm(customerRegistrationForm);
    this.router.navigate([this.returnUrl]);
  }

  encryptMD5(providePassword : string){
    return Md5.hashStr(providePassword).toString();
  }

  resetForm(customerRegistrationForm?: NgForm) {
    if (customerRegistrationForm != null) {
      customerRegistrationForm.reset();
    }

    this.customerService.selectedCustomer = {
      $key: null,
      FullName: '',
      Gender: '',
      Level: '',
      Username: '',
      Password: '',
      ConfirmPassword: '',
      PhoneNumber: '',
      Address: '',
    };
  }
}
