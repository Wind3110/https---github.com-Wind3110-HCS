import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Customer } from '../../../Model/CustomerModel/customer.model';
import { CustomerService } from '../../../Service/CustomerService/customer.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-customerregistration',
  templateUrl: './customerregistration.component.html',
  styleUrls: ['./customerregistration.component.css']
})
export class CustomerregistrationComponent implements OnInit {
  customerList: Customer[];
  returnUrl: string;
  private genderCombo: any[] = [{value:'Nam', name: "Nam"}, {value: 'Nữ', name: 'Nữ'}];

  constructor(private customerService: CustomerService, private tostr: ToastrService, private router: Router) { }

  ngOnInit() {
    this.returnUrl = '/customerpage/customerlogin';

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
    this.customerService.insertCustomer(customerRegistrationForm.value);
    this.tostr.success('Đăng ký thành công', 'Đăng ký tài khoản');
    this.resetForm(customerRegistrationForm);
    this.router.navigate([this.returnUrl]);
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
