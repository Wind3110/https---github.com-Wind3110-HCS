import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Service } from '../../../../Model/ServiceModel/service.model';
import { ServiceService } from '../../../../Service/SerService/service.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {

  closeResult: string;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  serviceList: Service[];

  constructor(private serviceService: ServiceService, private tostr: ToastrService, private modalService: NgbModal) { }

  ngOnInit(): void {

    this.resetForm();
    this.dtOptions = {
      // pagingType: 'full_numbers',
      // pageLength: 10,
      retrieve: true,
      //open paging in datatable
      paging: true,
      // scrollCollapse: true,
      language: {
        searchPlaceholder: "Search"
      },
      scrollY: "350px",
      // scrollX: true
    }

    this.resetForm();
    var x = this.serviceService.getData();
    x.snapshotChanges().subscribe(item => {
      this.serviceList = [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        this.serviceList.push(y as Service);
        this.dtTrigger.next();
      });
    });
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSubmit(serviceForm: NgForm) {
    if (serviceForm.value.$key == null)
      this.serviceService.insertService(serviceForm.value);
    else
      this.serviceService.updateService(serviceForm.value);
    this.resetForm(serviceForm);
    this.tostr.success('Submitted Succcessfully', 'Staff Register');
  }

  resetForm(serviceForm?: NgForm) {
    if (serviceForm != null)
      serviceForm.reset();
    this.serviceService.selectedService = {
      $key: null,
      ServiceName: '',
      descr: '',
      TimeUnit: null,
      Price: null
    }
  }

  onEdit(service: Service) {
    this.serviceService.selectedService = Object.assign({}, service);
  }

  onDelete(key: string) {
    if (confirm('Are you sure to delete this record ?') == true) {
      this.serviceService.deleteService(key);
      this.tostr.warning("Deleted Successfully", "Added Service");
    }
  }
}


