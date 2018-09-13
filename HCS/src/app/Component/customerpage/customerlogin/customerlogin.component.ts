import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Customer } from '../../../Model/CustomerModel/customer.model';
import { CustomerService } from '../../../Service/CustomerService/customer.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Md5 } from 'ts-md5/dist/md5';
import { AuthService } from '../../../Service/AuthService/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-customerlogin',
  templateUrl: './customerlogin.component.html',
  styleUrls: ['./customerlogin.component.css']
})
export class CustomerloginComponent implements OnInit {

  customerLoginForm: FormGroup;
  message: string;
  returnUrl: string;
  customerList: Customer[];
  submitted = false;

  constructor(private customerService: CustomerService, private tostr: ToastrService, private router: Router, public authService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.customerLoginForm = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
    this.returnUrl = '/customerhome';
    this.authService.logoutCustomer();

    var x = this.customerService.getData();
    x.snapshotChanges().subscribe(item => {
      this.customerList = [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        this.customerList.push(y as Customer);
      });
    });
  }

  get f() { return this.customerLoginForm.controls; }

  loginCustomer() {

    this.submitted = true;
    // stop here if form is invalid
    if (this.customerLoginForm.invalid) {
      return;
    }

    if (this.customerLoginForm.valid) {
      let i: number = 0;
      for (i; i <= this.customerList.length - 1; i++) {

        if (this.f.username.value === this.customerList[i].Username) {

          if (this.encryptMD5(this.f.password.value) === this.customerList[i].Password) {
            localStorage.setItem('isLoggedIn', "true");
            localStorage.setItem('token', this.f.username.value);
            this.router.navigate([this.returnUrl]);
            break;
          }
          else {
            this.message = "Please check your Username and Password";
            break;
          }
        }
        else {
          this.message = "Please check your Username and Password";
        }
      }
    }
  }

  encryptMD5(providePassword: string) {
    return Md5.hashStr(providePassword).toString();
  }

}
