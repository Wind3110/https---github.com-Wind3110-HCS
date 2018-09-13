import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DlDateTimePickerDateModule } from 'angular-bootstrap-datetimepicker';

import { Service } from '../../../Model/ServiceModel/service.model';
import { ServiceService } from '../../../Service/SerService/service.service';

import { StaffService } from '../../../Service/StaffService/staff.service'
import { Staff } from '../../../Model/StaffModel/staff.model';


@Component({
  selector: 'app-customerbooking',
  templateUrl: './customerbooking.component.html',
  styleUrls: ['./customerbooking.component.css']
})
export class CustomerbookingComponent implements OnInit {

  staff: Staff[];
  service: Service[];
  staffList: any[];
  serviceList: any[];
  bookingForm: FormGroup;

  dropdownServiceSettings = {};
  dropdownStaffSettings = {};

  constructor(private elementRef: ElementRef, private staffService: StaffService, private serviceSevice: ServiceService, private fb: FormBuilder) { }

  ngOnInit() {
 
    // Mutiple select service (ng-mutiselect-dropdown)
    this.dropdownServiceSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 14,
      // allowSearchFilter: true
    };

    this.dropdownStaffSettings = {
      singleSelection: true,
      allowSearchFilter: true
    };

    var x = this.staffService.getData();
    x.snapshotChanges().subscribe(item => {
      this.staff = [];
      item.forEach(element => {
        var y = element.payload.toJSON();
        y["$key"] = element.key;
        this.staff.push(y as Staff);

      });

      //push staff name to staffList
      this.staffList = [];
      this.staff.forEach(item => {
        this.staffList.push(item.FullName);
      });
      console.log(this.staffList)
    });

    var z = this.serviceSevice.getData();
    z.snapshotChanges().subscribe(item => {
      this.service = [];
      item.forEach(element => {
        var s = element.payload.toJSON();
        s["$key"] = element.key;
        this.service.push(s as Service);
      });

      //push service name to serviceList
      this.serviceList = [];
      this.service.forEach(item => {
        this.serviceList.push(item.ServiceName);
      });
      this.serviceList.push('Mặc định')
    });

    // this.bookingForm = this.fb.group({
    //   staffControl: [''],
    //   serviceControl: ['']
    // });
  }

  onItemSelect (item:any) {
    console.log(item);
  }
  onSelectAll (items: any) {
    console.log(items);
  }
}
