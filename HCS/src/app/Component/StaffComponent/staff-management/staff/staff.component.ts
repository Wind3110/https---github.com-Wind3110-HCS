import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'

import { StaffService } from '../../../../Service/StaffService/staff.service'
import { ToastrService } from 'ngx-toastr';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {

  constructor(private staffService: StaffService, private tostr: ToastrService, private modalService: NgbModal) { }

  ngOnInit() {
    this.resetForm();
  }

  open(content) {
    this.resetForm();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onSubmit(staffForm: NgForm) {
    
      this.staffService.insertStaff(staffForm.value);
      this.resetForm(staffForm);
      this.tostr.success('Created Succcessfully', 'Staff Create');
    // ngay khúc này reload lại datatable nè
  }

  resetForm(staffForm?: NgForm) {
    if (staffForm != null)
      staffForm.reset();
    this.staffService.selectedStaff = {
      $key: null,
      Username: '',
      Password: '',
      FullName: '',
      Sex: '',
      DayOfBirth: null,
      PhoneNumber: null,
      Address: '',
      Salary: null,
    }
  }
}
