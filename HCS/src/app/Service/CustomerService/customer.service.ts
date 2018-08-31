import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'
import { Customer } from '../../Model/CustomerModel/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  CustomerList: AngularFireList<any>;
  selectedCustomer: Customer = new Customer();
  constructor(private firebase: AngularFireDatabase) { }

  getData() {
    this.CustomerList = this.firebase.list('HCS_Customer');
    return this.CustomerList;
  }

  insertCustomer(customer: Customer) {
    this.CustomerList.push({
      FullName: customer.fullName,
      Gender: customer.gender,
      PhoneNumber: customer.phoneNumber,
      Level: customer.level,
      Username:customer.username,
      Psssword: customer.password
    });
  }

  updateCustomer(customer: Customer) {
    this.CustomerList.update(customer.$key,
      {
        FullName: customer.fullName,
        Gender: customer.gender,
        PhoneNumber: customer.phoneNumber,
        Level: customer.level,
        Username:customer.username,
        Psssword: customer.password
       
      });
  }

  deleteCustomer($key: string) {
    this.CustomerList.remove($key);
  }
}
