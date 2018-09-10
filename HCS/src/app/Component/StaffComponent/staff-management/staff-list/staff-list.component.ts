import { Component, OnInit } from '@angular/core';
import { StaffService } from '../../../../Service/StaffService/staff.service'
import { Staff } from '../../../../Model/StaffModel/staff.model';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css']
})
export class StaffListComponent implements OnInit {
  closeResult: string;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  staffList: Staff[];

  constructor(private staffService: StaffService, private tostr: ToastrService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.resetForm();
    this.dtOptions = {
      retrieve: true,
      processing: true,
      paging: true,
      language: {
        searchPlaceholder: "Search"
      },
      scrollX: true,
    }

    var x = this.staffService.getData();
    x.snapshotChanges().subscribe(item => {
      this.staffList = [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        this.staffList.push(y as Staff);
        this.dtTrigger.next();
      });
    });
  }

  open(content) {
    console.log(content);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  openDetail(detailContent) {
    this.modalService.open(detailContent, { size: 'lg' });
  }

  onSubmit(staffForm: NgForm) {
    this.staffService.updateStaff(staffForm.value);
    this.resetForm(staffForm);
    this.tostr.success('Updated Succcessfully', 'Staff Update');
  }

  resetForm(staffForm?: NgForm) {
    if (staffForm != null)
      staffForm.reset();
    this.staffService.selectedStaff = {
      $key: null,
      Username: '',
      Password: '',
      ConfirmPassword:'',
      FullName: '',
      Sex: '',
      DayOfBirth: null,
      PhoneNumber: null,
      Address: '',
      Salary: null,
    }
  }

  onEdit(sta: Staff) {
    if(sta.Password!==sta.ConfirmPassword){
      sta.Password=sta.ConfirmPassword;
    }
    this.staffService.selectedStaff = Object.assign({}, sta);
  }

  onDelete(key: string) {
    if (confirm('Are you sure to delete this record ?') == true) {
      this.staffService.deleteStaff(key);
      this.tostr.warning("Deleted Successfully");
    }
  }
}
