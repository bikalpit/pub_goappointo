import { Component, OnInit,Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AdminService } from '../_services/admin-main.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


export interface DialogData {
  animal: string;
 
 
}
@Component({
  selector: 'app-appointment-live',
  templateUrl: './appointment-live.component.html',
  styleUrls: ['./appointment-live.component.scss'],
  providers: [DatePipe]
})
export class AppointmentLiveComponent implements OnInit {
 
  animal: string;
  isLoaderAdmin : boolean = false;
  pendingAppointments : any;
  notAssignedAppointments : any;
  onTheWayAppointments : any;
  workStartedAppointments : any;
  staffList:any;
  todayDate:any;
  todayTime:any;
  todayDays:any;
  todayPeriod:any;

  constructor(
    private AdminService: AdminService,
    private datePipe: DatePipe,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getPendingAppointments();
    this.getNotAssignedAppointments();
    this.getOnThewayAppointments();
    this.getWorkStartedAppointments();
    
    this.todayDate = this.datePipe.transform(new Date(),"MMMM d")
    this.todayTime = this.datePipe.transform(new Date(),"h:mm ")
    this.todayPeriod = this.datePipe.transform(new Date(),"a")
    this.todayDays = this.datePipe.transform(new Date(),"EEEE")
    
  }
  getPendingAppointments(){
    this.AdminService.getPendingAppointments().subscribe((response:any) => {
      if(response.data == true){
        this.pendingAppointments = response.response
      }
      else if(response.data == false){
        this.pendingAppointments = ''
      }
    })
  }
  getNotAssignedAppointments(){
    this.AdminService.getNotAssignedAppointments().subscribe((response:any) => {
      if(response.data == true){
        this.notAssignedAppointments = response.response
      }
      else if(response.data == false){
        this.notAssignedAppointments = ''
      }
    })
  }

  getOnThewayAppointments(){
    this.AdminService.getOnThewayAppointments().subscribe((response:any) => {
      if(response.data == true){
        this.onTheWayAppointments = response.response
      }
      else if(response.data == false){
        this.onTheWayAppointments = ''
      }
    })
  }

  getWorkStartedAppointments(){
    this.AdminService.getWorkStartedAppointments().subscribe((response:any) => {
      if(response.data == true){
        this.workStartedAppointments = response.response
      }
      else if(response.data == false){
        this.workStartedAppointments = ''
      }
    })
  }


  fnOpenDetails(index){
    alert(index);
    const dialogRef = this.dialog.open(PendingAppointmentDetailsDialog, {
      height: '700px',
      //data: {animal: this.animal}
      data :{fulldata : this.pendingAppointments[index]}
     });
      dialogRef.afterClosed().subscribe(result => {
       this.animal = result;
      this.getPendingAppointments();
     
      });
  }

  fnOpenNotAssignedDetails(index){
    alert(index);
    const dialogRef = this.dialog.open(NotAssignedAppointmentDetailsDialog, {
      height: '700px',
      //data: {animal: this.animal}
      data :{fulldata : this.notAssignedAppointments[index]}
     });
      dialogRef.afterClosed().subscribe(result => {
       this.animal = result;
      this.getNotAssignedAppointments();
      
      });
  }

  
  fnOpenOnTheWayDetails(index){
    alert(index);
    const dialogRef = this.dialog.open(OnTheWayAppointmentDetailsDialog, {
      height: '700px',
      //data: {animal: this.animal}
      data :{fulldata : this.onTheWayAppointments[index]}
     });
      dialogRef.afterClosed().subscribe(result => {
       this.animal = result;
      this.getOnThewayAppointments();
      
      });
  }
  
  fnOpenWorkStartedDetails(index){
    alert(index);
    const dialogRef = this.dialog.open(WorkStartedAppointmentDetailsDialog, {
      height: '700px',
      //data: {animal: this.animal}
      data :{fulldata : this.workStartedAppointments[index]}
     });
      dialogRef.afterClosed().subscribe(result => {
       this.animal = result;
      this.getWorkStartedAppointments();
      
      });
  }
  
}

@Component({
  selector: 'pending-appointment-details',
  templateUrl: '../_dialogs/pending-appointment-details.html',
})
export class PendingAppointmentDetailsDialog {
//notes:any;
detailsData: any;
constructor(
  public dialogRef: MatDialogRef<PendingAppointmentDetailsDialog>,
  private AdminService: AdminService,
  //private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.detailsData =  this.data.fulldata;
    console.log(this.detailsData);
  }
onNoClick(): void {
  this.dialogRef.close();
}
}


@Component({
  selector: 'notassigned-appointment-details',
  templateUrl: '../_dialogs/notassigned-appointment-details.html',
})
export class NotAssignedAppointmentDetailsDialog {
//notes:any;
detailsData: any;
constructor(
  public dialogRef: MatDialogRef<NotAssignedAppointmentDetailsDialog>,
  private AdminService: AdminService,
  //private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.detailsData =  this.data.fulldata;
    console.log(this.detailsData);
  }
onNoClick(): void {
  this.dialogRef.close();
}
}

@Component({
  selector: 'ontheway-appointment-details',
  templateUrl: '../_dialogs/ontheway-appointment-details.html',
})
export class OnTheWayAppointmentDetailsDialog {
//notes:any;
detailsData: any;
constructor(
  public dialogRef: MatDialogRef<OnTheWayAppointmentDetailsDialog>,
  private AdminService: AdminService,
  //private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.detailsData =  this.data.fulldata;
    console.log(this.detailsData);
  }
onNoClick(): void {
  this.dialogRef.close();
}
}

@Component({
  selector: 'ontheway-appointment-details',
  templateUrl: '../_dialogs/workstarted-appointment-details.html',
})
export class WorkStartedAppointmentDetailsDialog {
//notes:any;
detailsData: any;
constructor(
  public dialogRef: MatDialogRef<WorkStartedAppointmentDetailsDialog>,
  private AdminService: AdminService,
  //private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any) {
    this.detailsData =  this.data.fulldata;
    console.log(this.detailsData);
  }
onNoClick(): void {
  this.dialogRef.close();
}
}
