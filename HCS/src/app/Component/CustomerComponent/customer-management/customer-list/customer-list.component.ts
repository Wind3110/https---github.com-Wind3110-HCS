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
  requiredMsg:string;

  constructor(private customerService: CustomerService, private tostr: ToastrService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.requiredMsg = 'Trường bắt buộc';
    this.resetForm();
    this.dtOptions = {
      retrieve: true,
      processing: true,
      scrollX: true,
      language: {
        searchPlaceholder: "Tìm"
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
    this.modalService.open(content, { size: 'lg' });
  }

  openDetail(contentDetail) {
    this.modalService.open(contentDetail, { size: 'lg' });
  }

  onSubmit(customerForm: NgForm) {
    this.customerService.updateCustomer(customerForm.value);
    this.resetForm(customerForm);
    this.tostr.success('Cập nhật thành công', 'Cập nhật thông tin khách hàng');
  }

  resetForm(customerForm?: NgForm) {
    if (customerForm != null)
      customerForm.reset();
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
    }
  }

  onEdit(customer: Customer) {
    this.customerService.selectedCustomer = Object.assign({}, customer);
  }

  onDelete(key: string) {
    if (confirm('Bạn có chắc muốn xoá dữ liệu này?') == true) {
      this.customerService.deleteCustomer(key);
      this.tostr.warning("Xoá thành công", "Xoá thông tin khách hàng");
    }
  }
}


