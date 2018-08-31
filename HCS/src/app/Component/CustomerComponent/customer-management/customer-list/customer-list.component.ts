import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Customer } from '../../../../Model/CustomerModel/customer.model';
import { CustomerService } from '../../../../Service/CustomerService/customer.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  customerList: Customer[];

  constructor(private customerService: CustomerService, private tostr: ToastrService, private modalService: NgbModal) { }

  ngOnInit(): void {

    this.resetForm();
    this.dtOptions = {
      retrieve: true,
      processing: true,
      scrollX: true,
      language: {
        searchPlaceholder: "Search"
      },
    }

    this.resetForm();
    var x = this.customerService.getData();
    x.snapshotChanges().subscribe(item => {
      this.customerList = [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        this.customerList.push(y as Customer);
        this.dtTrigger.next();
      });
    });
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  openDetail(contentDetail) {
    this.modalService.open(contentDetail, { size: 'lg' });
  }

  onSubmit(customerForm: NgForm) {
    if (customerForm.value.$key == null)
      this.customerService.insertCustomer(customerForm.value);
    else
      this.customerService.updateCustomer(customerForm.value);
    this.resetForm(customerForm);
    this.tostr.success('Submitted Succcessfully', 'Staff Register');
  }

  resetForm(customerForm?: NgForm) {
    if (customerForm != null)
    customerForm.reset();
    this.customerService.selectedCustomer = {
      $key: null,
      FullName: '',
      Gender: '',
      Level: '',
      Username:'',
      Password: '',
      PhoneNumber:''
    }
  }

  onEdit(customer: Customer) {
    this.customerService.selectedCustomer = Object.assign({}, customer);
  }

  onDelete(key: string) {
    if (confirm('Are you sure to delete this record ?') == true) {
      this.customerService.deleteCustomer(key);
      this.tostr.warning("Deleted Successfully", "Added Customer");
    }
  }
}


