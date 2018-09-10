import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'

import { ServiceService } from '../../../../Service/SerService/service.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  constructor(private serviceService: ServiceService, private tostr: ToastrService, private modalService: NgbModal) { }

  ngOnInit() {
  }

  open(content) {
    this.resetForm();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSubmit(serviceForm: NgForm) {
    this.serviceService.insertService(serviceForm.value);
    this.resetForm(serviceForm);
    this.tostr.success('Submitted Succcessfully', 'Added Service ');

    // ngay khúc này reload lại datatable nè
  }

  resetForm(serviceForm?: NgForm) {
    if (serviceForm != null) {
      serviceForm.reset();
    }
    this.serviceService.selectedService = {
      $key: null,
      ServiceName: '',
      descr: '',
      TimeUnit: null,
      Price: null,
    }
  }
}
