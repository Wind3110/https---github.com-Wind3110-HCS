import {Service} from '../ServiceModel/service.model';
import { Time } from '../../../../node_modules/@angular/common';
export class Booking {
    $key : string;
    CustomerName : string;
    Gender : string;
    Phone:string;
    Services : Service[];
    StaffName:string;
    Date : Date;
    Time : Time;
}
