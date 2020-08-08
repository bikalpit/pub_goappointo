import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { StaffService } from '../_services/staff.service';
import { DatePipe} from '@angular/common';
import { AuthenticationService } from '@app/_services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';

export interface status {
  
  statuses: string;
  value :string;
  viewValue:string;
  
}
export interface DialogData {
  animal: string;
  name: string;
 
}

@Component({
  selector: 'app-my-work-space',
  templateUrl: './my-work-space.component.html',
  styleUrls: ['./my-work-space.component.scss'],
  providers: [DatePipe]
})
export class MyWorkSpaceComponent implements OnInit {
  

  animal: string;
  todayAppointmentData: any;
  activeBooking: any;
  todayDate: any;
  bussinessId: any;
  settingsArr:any=[];
  currencySymbol:any;
  currencySymbolPosition:any;
  currencySymbolFormat:any;
  staffId :any
  notes:any;
  isLoader:boolean= false;
  token :any
  constructor(
    public dialog: MatDialog,
    private StaffService: StaffService,
    private authenticationService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private titleService: Title

  ) {
    this.bussinessId=this.authenticationService.currentUserValue.business_id
    this.staffId=JSON.stringify(this.authenticationService.currentUserValue.user_id);
    this.token=this.authenticationService.currentUserValue.token;
  }

  ngOnInit() {
    this.titleService.setTitle('My Workspace');
    this.todayDate = this.datePipe.transform(new Date(),"dd MMM yyyy");
    this.fnGetSettingValue();
    this.getTodayAppointment();
  }

  fnGetSettingValue(){
    let requestObject = {
      "business_id":this.bussinessId
    };
    this.StaffService.getSettingValue(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.settingsArr=response.response;
        console.log(this.settingsArr);

        this.currencySymbol = this.settingsArr.currency;
        console.log(this.currencySymbol);
        
        this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
        console.log(this.currencySymbolPosition);
        
        this.currencySymbolFormat = this.settingsArr.currency_format;
        console.log(this.currencySymbolFormat);
      }
      else if(response.data == false){
        
      }
    })
  }
  changeBookingStatus(order_item_id, status){
    alert(order_item_id+status)
    this.isLoader=true;
    let requestObject = {
      'order_item_id': order_item_id,
      'order_status': status,
      'notes' : this.notes,
      'staff_id' : this.staffId
    };
    
      this.StaffService.changeStatus(requestObject).subscribe((response:any) =>{
        if(response.data == true){
          this._snackBar.open("Appointment Updated", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
          });
          this.getTodayAppointment();
          
        }
        else if(response.data == false) {
          this._snackBar.open("Appointment Not Updated", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          }); 
        }
      })
    this.isLoader=false;
  }

  getTodayAppointment(){
    let requestObject = {
      'staff_id' : this.staffId,
      'business_id': this.bussinessId,
      'staff_token': this.token
    };
    this.StaffService.getTodayAppointment(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.todayAppointmentData = response.response
        this.todayAppointmentData.forEach( (element) => {
          var todayDateTime = new Date();
          element.booking_time=element.booking_date+" "+element.booking_time;
          var dateTemp = new Date(this.datePipe.transform(new Date(element.booking_time),"dd MMM yyyy hh:mm a"));
          dateTemp.setMinutes( dateTemp.getMinutes() + parseInt(element.service_time) );
          var temp = dateTemp.getTime() - todayDateTime.getTime();
          element.timeToService=(temp/3600000).toFixed();
          element.booking_time=this.datePipe.transform(new Date(element.booking_time),"hh:mm a")
          element.booking_time_to=this.datePipe.transform(new Date(dateTemp),"hh:mm a")
          element.booking_date=this.datePipe.transform(new Date(element.booking_date),"dd MMM yyyy")
          element.created_at=this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy @ hh:mm a")
        });
        this.activeBooking = 0;
      }
      else if(response.data == false){
        this.todayAppointmentData = ''
      }
    })
  }
  fnBookingActive(index){
    this.activeBooking = index;
  }
  todayAppointmentDetail(index){
    const dialogRef = this.dialog.open(DialogTodayAppointmentDetail, {
      height: '700px',
      data:{ fullData : this.todayAppointmentData[index]}
    });

     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }

}

@Component({
  selector: 'today-appointment-details',
  templateUrl: '../_dialogs/today-appointment-details.html',
})
export class DialogTodayAppointmentDetail {

appoDetail : any;
bussinessId: any;
settingsArr:any=[];
currencySymbol:any;
currencySymbolPosition:any;
currencySymbolFormat:any;
activityLog:any=[];
constructor(
  public dialogRef: MatDialogRef<DialogTodayAppointmentDetail>,
  private StaffService: StaffService,
  private authenticationService: AuthenticationService,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.appoDetail = this.data.fullData;
    this.fnGetActivityLog(this.appoDetail.id);
    this.bussinessId=this.authenticationService.currentUserValue.business_id
    this.fnGetSettingValue();
    console.log(this.appoDetail);
  }

onNoClick(): void {
  this.dialogRef.close();
}
    fnGetSettingValue(){
      let requestObject = {
        "business_id":this.bussinessId
      };
      this.StaffService.getSettingValue(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this.settingsArr=response.response;
          console.log(this.settingsArr);

          this.currencySymbol = this.settingsArr.currency;
          console.log(this.currencySymbol);
          
          this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
          console.log(this.currencySymbolPosition);
          
          this.currencySymbolFormat = this.settingsArr.currency_format;
          console.log(this.currencySymbolFormat);
        }
        else if(response.data == false){
          
        }
      })
    }

    fnGetActivityLog(orderItemId){
      let requestObject = {
        "order_item_id":orderItemId
      };
      this.StaffService.getActivityLog(requestObject).subscribe((response:any) => {
        if(response.data == true){
          console.log(response.response);
          this.activityLog=response.response;
        }
        else if(response.data == false){
          this.activityLog=[];
        }
      })
    }

}
