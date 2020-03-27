import { Component, OnInit, Inject } from '@angular/core';
import { Subject, from } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '@app/_services';
import { AdminSettingsService } from '../_services/admin-settings.service';
import { DatePipe} from '@angular/common';
import { ConfirmationDialogComponent } from '../../../_components/confirmation-dialog/confirmation-dialog.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

export interface DialogData {
  selectedStaffId: any;
}

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss'],
  providers: [DatePipe]
})
export class StaffComponent implements OnInit {
  animal: any;
  isLoaderAdmin: boolean = false;
  StaffCreate: FormGroup;
  addStaffPage: boolean = false;
  staffListPage: boolean = true;
  singleStaffView: boolean = false;
  businessId: any;
  allStaffList: any;
  staffActionId: any = [];
  addPostalCodeId: any = [];
  singleStaffStatus: any;
  singleStaffDetail: any;
  staffImageUrl:any;
  selectedServicesArr:any=[];
  selectedPostalCodeArr:any=[];
  staffInternalStatus : any;
  staffLoginStatus : any;
  selectedStaffId : any;
  singlePostalCodeStatus : any; 
  selectedValue : any; 

  formSetWorkingHours: FormGroup;
  timeSlotList: any=[];
  workingHoursList: any=[];
  mondayOn : boolean;
  tuesdayOn : boolean;
  wednesdayOn : boolean;
  thursdayOn : boolean;
  fridayOn : boolean;
  saturdayOn : boolean;
  sundayOn : boolean;

  breakTimeList: any=[];
  selectedStartTimeMonday: any;
  selectedEndTimeMonday: any;
  selectedStartTimeTuesday: any;
  selectedEndTimeTuesday: any;
  selectedStartTimeWednesday: any;
  selectedEndTimeWednesday: any;
  selectedStartTimeThursday: any;
  selectedEndTimeThursday: any;
  selectedStartTimeFriday: any;
  selectedEndTimeFriday: any;
  selectedStartTimeSaturday: any;
  selectedEndTimeSaturday: any;
  selectedStartTimeSunday: any;
  selectedEndTimeSunday: any;
  showMondayAddForm: boolean=false;
  showTuesdayAddForm: boolean=false;
  showWednesdayAddForm: boolean=false;
  showThursdayAddForm: boolean=false;
  showFridayAddForm: boolean=false;
  showSaturdayAddForm: boolean=false;
  showSundayAddForm: boolean=false;
  
  timeOffList: any=[];

  constructor(
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private adminSettingsService: AdminSettingsService,
    private datePipe: DatePipe,
  ) {
    localStorage.setItem('isBusiness', 'false');
    if (localStorage.getItem('business_id')) {
      this.businessId = localStorage.getItem('business_id');
    }
    this.fnGetTimeSlotsList("08:00","23:00","30");
    this.formSetWorkingHours = this._formBuilder.group({
      mondayToggle: [false],
      mondayStartTime: [this.timeSlotList[0].long],
      mondayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
      tuesdayToggle: [false],
      tuesdayStartTime: [this.timeSlotList[0].long],
      tuesdayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
      wednesdayToggle: [false],
      wednesdayStartTime: [this.timeSlotList[0].long],
      wednesdayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
      thursdayToggle: [false],
      thursdayStartTime: [this.timeSlotList[0].long],
      thursdayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
      fridayToggle: [false],
      fridayStartTime: [this.timeSlotList[0].long],
      fridayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
      saturdayToggle: [false],
      saturdayStartTime: [this.timeSlotList[0].long],
      saturdayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
      sundayToggle: [false],
      sundayStartTime: [this.timeSlotList[0].long],
      sundayEndTime: [this.timeSlotList[this.timeSlotList.length - 1].long],
    })
  }

  ngOnInit() {
    this.getAllStaff();
  }

  getAllStaff() {
    this.isLoaderAdmin = true;
    this.adminSettingsService.getAllStaff().subscribe((response: any) => {
      if (response.data == true) {
        this.allStaffList = response.response
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.allStaffList = '';
        this.isLoaderAdmin = false;
      }
    })
  }

  fnAddStaffId(event, staffId) {
    if (event == true) {
      this.staffActionId.push(staffId)
    }
    else if (event == false) {
      const index = this.staffActionId.indexOf(staffId, 0);
      if (index > -1) {
        this.staffActionId.splice(index, 1);
      }
    }
  }
  fnActionStaff(action) {
    this.isLoaderAdmin = true;
    this.adminSettingsService.fnActionStaff(action, this.staffActionId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Staff Status Updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.selectedValue = undefined
        this.staffActionId.length = 0;
        this.getAllStaff();
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }
  fnChangeStaffStatus(event, staffId) {
    if (event == true) {
      this.singleStaffStatus = 'E'
    }
    else if (event == false) {
      this.singleStaffStatus = 'D'
    }
    this.staffActionId.push(staffId)
    this.adminSettingsService.fnActionStaff(this.singleStaffStatus, this.staffActionId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Staff Status Updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.getAllStaff();
        this.staffActionId.length = 0;
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }

  fnViewSingleStaff(staffId) {
    this.isLoaderAdmin = true;
    this.selectedStaffId= staffId;
    this.adminSettingsService.fnViewSingleStaff(staffId).subscribe((response: any) => {
      if (response.data == true) {
        this.singleStaffDetail = response.response
        console.log(this.singleStaffDetail);
        this.singleStaffDetail.staff[0].services.forEach(element => {
          this.selectedServicesArr.push(element.id);
        });
        this.singleStaffDetail.staff[0].postal_codes.forEach(element => {
          this.selectedPostalCodeArr.push(element.id);
        });
        console.log( this.selectedPostalCodeArr);
        if(this.singleStaffDetail.workingHours.length>0){
          this.workingHoursList=this.singleStaffDetail.workingHours;
          console.log(this.workingHoursList);
          this.workingHoursList.forEach(element => {
            if(element.week_day_id == 0){
              element.week_day_name="Sunday";
              if(element.off_day=="N"){
                this.sundayOn=true;
              }else{
                this.sundayOn=false;
              }
              if(element.day_start_time && element.day_end_time){
                element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
                element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
              }
            }
            if(element.week_day_id == 1){
              element.week_day_name="Monday";            
              if(element.off_day=="N"){
                this.mondayOn=true;
              }else{
                this.mondayOn=false;
              }
              if(element.day_start_time && element.day_end_time){
                element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
                element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
              }
            }
            if(element.week_day_id == 2){
              element.week_day_name="Tuesday";         
              if(element.off_day=="N"){
                this.tuesdayOn=true;
              }else{
                this.tuesdayOn=false;
              }
              if(element.day_start_time && element.day_end_time){
                element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
                element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
              }
            }
            if(element.week_day_id == 3){
              element.week_day_name="Wednesday";        
              if(element.off_day=="N"){
                this.wednesdayOn=true;
              }else{
                this.wednesdayOn=false;
              }
              if(element.day_start_time && element.day_end_time){
              element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
              element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
              }
            }
            if(element.week_day_id == 4){
              element.week_day_name="Thursday";       
              if(element.off_day=="N"){
                this.thursdayOn=true;
              }else{
                this.thursdayOn=false;
              }
              if(element.day_start_time && element.day_end_time){
              element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
              element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
              }
            }
            if(element.week_day_id == 5){
              element.week_day_name="Friday";     
              if(element.off_day=="N"){
                this.fridayOn=true;
              }else{
                this.fridayOn=false;
              }
              if(element.day_start_time && element.day_end_time){
              element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
              element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
              }
            }
            if(element.week_day_id == 6){
              element.week_day_name="Saturday";    
              if(element.off_day=="N"){
                this.saturdayOn=true;
              }else{
                this.saturdayOn=false;
              }
              if(element.day_start_time && element.day_end_time){
              element.day_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_start_time),"HH:mm");
              element.day_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.day_end_time),"HH:mm");
              }
            }
          });
  
          this.formSetWorkingHours = this._formBuilder.group({
            mondayToggle: [this.workingHoursList[0].off_day=="N"?true:false,this.mondayOn?Validators.required:''],
            mondayStartTime: [this.workingHoursList[0].day_start_time,this.mondayOn?Validators.required:''],
            mondayEndTime: [this.workingHoursList[0].day_end_time,this.mondayOn?Validators.required:''],
            tuesdayToggle: [this.workingHoursList[1].off_day=="N"?true:false,this.tuesdayOn?Validators.required:''],
            tuesdayStartTime: [this.workingHoursList[1].day_start_time,this.tuesdayOn?Validators.required:''],
            tuesdayEndTime: [this.workingHoursList[1].day_end_time,this.tuesdayOn?Validators.required:''],
            wednesdayToggle: [this.workingHoursList[2].off_day=="N"?true:false,this.wednesdayOn?Validators.required:''],
            wednesdayStartTime: [this.workingHoursList[2].day_start_time,this.wednesdayOn?Validators.required:''],
            wednesdayEndTime: [this.workingHoursList[2].day_end_time,this.wednesdayOn?Validators.required:''],
            thursdayToggle: [this.workingHoursList[3].off_day=="N"?true:false,this.thursdayOn?Validators.required:''],
            thursdayStartTime: [this.workingHoursList[3].day_start_time,this.thursdayOn?Validators.required:''],
            thursdayEndTime: [this.workingHoursList[3].day_end_time,this.thursdayOn?Validators.required:''],
            fridayToggle: [this.workingHoursList[4].off_day=="N"?true:false,this.fridayOn?Validators.required:''],
            fridayStartTime: [this.workingHoursList[4].day_start_time,this.fridayOn?Validators.required:''],
            fridayEndTime: [this.workingHoursList[4].day_end_time,this.fridayOn?Validators.required:''],
            saturdayToggle: [this.workingHoursList[5].off_day=="N"?true:false,this.saturdayOn?Validators.required:''],
            saturdayStartTime: [this.workingHoursList[5].day_start_time,this.saturdayOn?Validators.required:''],
            saturdayEndTime: [this.workingHoursList[5].day_end_time,this.saturdayOn?Validators.required:''],
            sundayToggle: [this.workingHoursList[6].off_day=="N"?true:false,this.sundayOn?Validators.required:''],
            sundayStartTime: [this.workingHoursList[6].day_start_time,this.sundayOn?Validators.required:''],
            sundayEndTime: [this.workingHoursList[6].day_end_time,this.sundayOn?Validators.required:''],
          })
        }
        if(this.singleStaffDetail.breaktime.length>0){
          this.breakTimeList= this.singleStaffDetail.breaktime;
          console.log(this.breakTimeList);
          this.breakTimeList.forEach(element => {
            if(element.break_start_time){
             element.break_start_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.break_start_time),"HH:mm");
            }
            if(element.break_end_time){
              element.break_end_time=this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+element.break_end_time),"HH:mm");
            }
          });
        }else{
          this.breakTimeList= [];
        }

        if(this.singleStaffDetail.timeoff.length>0){
        this.timeOffList= this.singleStaffDetail.timeoff;
        console.log(this.timeOffList);
        this.timeOffList.forEach(element => {
          if(element.start_date){
            element.start_date=this.datePipe.transform(new Date(element.start_date),"MMM dd, yyyy");
          }
          if(element.end_date){
            element.end_date=this.datePipe.transform(new Date(element.end_date),"MMM dd, yyyy");
          }
        });
      }else{
        this.timeOffList= [];
      }

        this.staffListPage = false;
        this.singleStaffView = true;
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }
  fnChangeInternalStaff(event, staffId){
    if (event == true) {
      this.staffInternalStatus = 'Y'
    }
    else if (event == false) {
      this.staffInternalStatus = 'N'
    }
    this.adminSettingsService.fnChangeInternalStaff(this.staffInternalStatus, staffId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open("Internal Staff Status Updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }
  fnChangeLoginAllowStaff(event, staffId){
    if (event == true) {
      this.staffLoginStatus = 'Y'
    }
    else if (event == false) {
      this.staffLoginStatus = 'N'
    }
    this.adminSettingsService.fnChangeLoginAllowStaff(this.staffLoginStatus, staffId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }
  fnAddPostalCodeId(event, postalCodeId) {
    if (event == true) {
      this.addPostalCodeId.push(postalCodeId)
    }
    else if (event == false) {
      const index = this.addPostalCodeId.indexOf(postalCodeId, 0);
      if (index > -1) {
        this.addPostalCodeId.splice(index, 1);
      }
    }
  }
  fnAssignPostalToStaff(value){
    this.adminSettingsService.fnAssignPostalToStaff(value, this.addPostalCodeId, this.selectedStaffId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.selectedPostalCodeArr.length = 0;
        this.fnViewSingleStaff(this.selectedStaffId)
        this.addPostalCodeId.length = 0;
        this.selectedValue = undefined
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }
  fnSingleAssignPostalCode(event, postalCodeId){
    if(event == true){
      this.singlePostalCodeStatus = 'E'
    }else if(event == false){
      this.singlePostalCodeStatus = 'D'
    }
    this.addPostalCodeId.push(postalCodeId)
    this.adminSettingsService.fnAssignPostalToStaff(this.singlePostalCodeStatus, this.addPostalCodeId, this.selectedStaffId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.selectedPostalCodeArr.length= 0;
        this.fnViewSingleStaff(this.selectedStaffId)
        this.addPostalCodeId.length = 0;
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }

  fnAssignServiceToStaff(event, serviceId){
    alert(event+" | "+serviceId)
    this.adminSettingsService.fnAssignServiceToStaff(event, serviceId, this.selectedStaffId).subscribe((response: any) => {
      if (response.data == true) {
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.fnViewSingleStaff(this.selectedStaffId)
        this.isLoaderAdmin = false;
      }
      else if (response.data == false) {
        this.isLoaderAdmin = false;
      }
    })
  }

  addTimeOff() {
    const dialogRef = this.dialog.open(DialogAddNewTimeOff, {
      width: '500px',
      data:{selectedStaffId:this.selectedStaffId}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result != undefined){
        if(result.call==true){
        this.fnViewSingleStaff(this.selectedStaffId);
       }
      }
    });
  }

  staffImage() {
    const dialogRef = this.dialog.open(DialogStaffImageUpload, {
      width: '500px',
      
    });
  
     dialogRef.afterClosed().subscribe(result => {
        if(result != undefined){
            this.staffImageUrl = result;
           }
     });
  }

  fnGetTimeSlotsList(start, end,interval){
    var start = start.split(":");
    var end = end.split(":");

    start = parseInt(start[0]) * 60 + parseInt(start[1]);
    end = parseInt(end[0]) * 60 + parseInt(end[1]);

    var result = [];

    for ( var time = start; time <= end; time+=parseInt(interval)){
        result.push( this.timeString(time));
    }
  
    this.timeSlotList=result;
    console.log(this.timeSlotList[0]);
  }

  timeString(time){
      var hours = Math.floor(time / 60);
      var minutes = time % 60;

      if (hours < 10)
      {
        let h="0" + hours;
        hours = parseFloat(h); //optional
      } 
      if (minutes < 10)
      {
        let m="0" + minutes;
        minutes = parseFloat(m); //optional
      }  
      let tempArr={
        //long: hours + ":" + minutes,
        long: this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+hours + ":" + minutes),"HH:mm"),
        short:this.datePipe.transform(new Date(this.datePipe.transform(new Date(),"yyyy-MM-dd")+" "+hours + ":" + minutes),"hh:mm a")
      };
     return tempArr;
  }

  fnChangeToggle(event,day){
    console.log(event);
    if(day=="Monday"){
      this.mondayOn=event.checked;
    }
    if(day=="Tuesday"){
      this.tuesdayOn=event.checked;
    }
    if(day=="Wednesday"){
      this.wednesdayOn=event.checked;
    }
    if(day=="Thursday"){
      this.thursdayOn=event.checked;
    }
    if(day=="Friday"){
      this.fridayOn=event.checked;
    }
    if(day=="Saturday"){
      this.saturdayOn=event.checked;
    }
    if(day=="Sunday"){
      this.sundayOn=event.checked;
    }
    
    this.fnFormBuild(this.mondayOn,this.tuesdayOn,this.wednesdayOn,this.thursdayOn,this.fridayOn,this.saturdayOn,this.sundayOn);
  }

  fnFormBuild(mondayOn,tuesdayOn,wednesdayOn,thursdayOn,fridayOn,saturdayOn,sundayOn){
    console.log(mondayOn+"--"+tuesdayOn+"--"+wednesdayOn+"--"+thursdayOn+"--"+fridayOn+"--"+saturdayOn+"--"+sundayOn);
    this.formSetWorkingHours = this._formBuilder.group({
      mondayToggle: [this.formSetWorkingHours.get("mondayToggle").value?true:false,mondayOn?Validators.required:''],
      mondayStartTime: [this.formSetWorkingHours.get("mondayStartTime").value,mondayOn?Validators.required:''],
      mondayEndTime: [this.formSetWorkingHours.get("mondayEndTime").value,mondayOn?Validators.required:''],
      tuesdayToggle: [this.formSetWorkingHours.get("tuesdayToggle").value?true:false,tuesdayOn?Validators.required:''],
      tuesdayStartTime: [this.formSetWorkingHours.get("tuesdayStartTime").value,tuesdayOn?Validators.required:''],
      tuesdayEndTime: [this.formSetWorkingHours.get("tuesdayEndTime").value,tuesdayOn?Validators.required:''],
      wednesdayToggle: [this.formSetWorkingHours.get("wednesdayToggle").value?true:false,wednesdayOn?Validators.required:''],
      wednesdayStartTime: [this.formSetWorkingHours.get("wednesdayStartTime").value,wednesdayOn?Validators.required:''],
      wednesdayEndTime: [this.formSetWorkingHours.get("wednesdayEndTime").value,wednesdayOn?Validators.required:''],
      thursdayToggle: [this.formSetWorkingHours.get("thursdayToggle").value?true:false,thursdayOn?Validators.required:''],
      thursdayStartTime: [this.formSetWorkingHours.get("thursdayStartTime").value,thursdayOn?Validators.required:''],
      thursdayEndTime: [this.formSetWorkingHours.get("thursdayEndTime").value,thursdayOn?Validators.required:''],
      fridayToggle: [this.formSetWorkingHours.get("fridayToggle").value?true:false,fridayOn?Validators.required:''],
      fridayStartTime: [this.formSetWorkingHours.get("fridayStartTime").value,fridayOn?Validators.required:''],
      fridayEndTime: [this.formSetWorkingHours.get("fridayEndTime").value,fridayOn?Validators.required:''],
      saturdayToggle: [this.formSetWorkingHours.get("saturdayToggle").value?true:false,saturdayOn?Validators.required:''],
      saturdayStartTime: [this.formSetWorkingHours.get("saturdayStartTime").value,saturdayOn?Validators.required:''],
      saturdayEndTime: [this.formSetWorkingHours.get("saturdayEndTime").value,saturdayOn?Validators.required:''],
      sundayToggle: [this.formSetWorkingHours.get("sundayToggle").value?true:false,sundayOn?Validators.required:''],
      sundayStartTime: [this.formSetWorkingHours.get("sundayStartTime").value,sundayOn?Validators.required:''],
      sundayEndTime: [this.formSetWorkingHours.get("sundayEndTime").value,sundayOn?Validators.required:''],
    })
  }

  fnCreateWorkingHours(){
    this.isLoaderAdmin = true;
    if(this.formSetWorkingHours.invalid){
      alert();
      return false;
    }
    let workingHoursArray:any=[];
    let workingHoursTempArray={
      dayNumber:"",
      start_time:"",
      end_time:"",
      offday:""
    };

    workingHoursTempArray={
      dayNumber:"1",
      start_time:this.formSetWorkingHours.get("mondayStartTime").value,
      end_time:this.formSetWorkingHours.get("mondayEndTime").value,
      offday:this.formSetWorkingHours.get("mondayToggle").value?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"2",
      start_time:this.formSetWorkingHours.get("tuesdayStartTime").value,
      end_time:this.formSetWorkingHours.get("tuesdayEndTime").value,
      offday:this.formSetWorkingHours.get("tuesdayToggle").value?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"3",
      start_time:this.formSetWorkingHours.get("wednesdayStartTime").value,
      end_time:this.formSetWorkingHours.get("wednesdayEndTime").value,
      offday:this.formSetWorkingHours.get("wednesdayToggle").value?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"4",
      start_time:this.formSetWorkingHours.get("thursdayStartTime").value,
      end_time:this.formSetWorkingHours.get("thursdayEndTime").value,
      offday:this.formSetWorkingHours.get("thursdayToggle").value?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"5",
      start_time:this.formSetWorkingHours.get("fridayStartTime").value,
      end_time:this.formSetWorkingHours.get("fridayEndTime").value,
      offday:this.formSetWorkingHours.get("fridayToggle").value?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"6",
      start_time:this.formSetWorkingHours.get("saturdayStartTime").value,
      end_time:this.formSetWorkingHours.get("saturdayEndTime").value,
      offday:this.formSetWorkingHours.get("saturdayToggle").value?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);

    workingHoursTempArray={
      dayNumber:"0",
      start_time:this.formSetWorkingHours.get("sundayStartTime").value,
      end_time:this.formSetWorkingHours.get("sundayEndTime").value,
      offday:this.formSetWorkingHours.get("sundayToggle").value?"N":"Y"
    };
    workingHoursArray.push(workingHoursTempArray);
    console.log(JSON.stringify(workingHoursArray));
    let requestObject={
      "staff_id":this.selectedStaffId,
      "workingHour":workingHoursArray
    }
    console.log(JSON.stringify(requestObject));

    this.adminSettingsService.createWorkingHoursStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnViewSingleStaff(this.selectedStaffId);
        this._snackBar.open("Working Hours Updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['green-snackbar']
        });
      }
      else{
      this.isLoaderAdmin = false;
      this._snackBar.open("Working Hours Not Updated", "X", {
        duration: 2000,
        verticalPosition: 'bottom',
        panelClass : ['red-snackbar']
      });
      }
    })
  }

  fnApplyToAll(){
    if(!this.mondayOn){
      return false;
    }
    if(this.formSetWorkingHours.get("mondayToggle").value){
      if(this.formSetWorkingHours.get("mondayStartTime").value == '' || this.formSetWorkingHours.get("mondayEndTime").value == '' || this.formSetWorkingHours.get("mondayStartTime").value == null || this.formSetWorkingHours.get("mondayEndTime").value == null){
        alert();
        return false;
      }
    }
    this.isLoaderAdmin = true;
    let requestObject={
      "staff_id":this.selectedStaffId,
      "start_time":this.formSetWorkingHours.get("mondayStartTime").value,
      "end_time":this.formSetWorkingHours.get("mondayEndTime").value,
      "off_day":this.formSetWorkingHours.get("mondayToggle").value?"N":"Y"
    }
    console.log(JSON.stringify(requestObject));
    
    this.adminSettingsService.applyToAllStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnViewSingleStaff(this.selectedStaffId);
        this._snackBar.open("Working Hours applied to all", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['green-snackbar']
        });
      }
      else{
      this.isLoaderAdmin = false;
      this._snackBar.open("Working Hours Not Updated", "X", {
        duration: 2000,
        verticalPosition: 'bottom',
        panelClass : ['red-snackbar']
      });
      }
    })
  }

  fnWorkingHoursResetToDefault(){
    this.isLoaderAdmin = true;
    let requestObject={
      "business_id":this.businessId,
      "staff_id":this.selectedStaffId
    }
    this.adminSettingsService.workingHoursResetToDefault(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnViewSingleStaff(this.selectedStaffId);
        this._snackBar.open("Working Hours Reset", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['green-snackbar']
        });
      }
      else{
      this.isLoaderAdmin = false;
      this._snackBar.open("Working Hours Not Reset", "X", {
        duration: 2000,
        verticalPosition: 'bottom',
        panelClass : ['red-snackbar']
      });
      }
    })
  }
  
  fnShowAddBreakForm(day){
    if(day == "Monday"){
      this.selectedStartTimeMonday=this.timeSlotList[0].long;
      this.selectedEndTimeMonday=this.timeSlotList[this.timeSlotList.length-1].long;
      this.showMondayAddForm=this.showMondayAddForm==true?false:true;
    }
    if(day == "Tuesday"){
      this.selectedStartTimeTuesday=this.timeSlotList[0].long;
      this.selectedEndTimeTuesday=this.timeSlotList[this.timeSlotList.length-1].long;
      this.showTuesdayAddForm=this.showTuesdayAddForm==true?false:true;
    }
    if(day == "Wednesday"){
      this.selectedStartTimeWednesday=this.timeSlotList[0].long;
      this.selectedEndTimeWednesday=this.timeSlotList[this.timeSlotList.length-1].long;
      this.showWednesdayAddForm=this.showWednesdayAddForm==true?false:true;
    }
    if(day == "Thursday"){
      this.selectedStartTimeThursday=this.timeSlotList[0].long;
      this.selectedEndTimeThursday=this.timeSlotList[this.timeSlotList.length-1].long;
      this.showThursdayAddForm=this.showThursdayAddForm==true?false:true;
    }
    if(day == "Friday"){
      this.selectedStartTimeFriday=this.timeSlotList[0].long;
      this.selectedEndTimeFriday=this.timeSlotList[this.timeSlotList.length-1].long;
      this.showFridayAddForm=this.showFridayAddForm==true?false:true;
    }
    if(day == "Saturday"){
      this.selectedStartTimeSaturday=this.timeSlotList[0].long;
      this.selectedEndTimeSaturday=this.timeSlotList[this.timeSlotList.length-1].long;
      this.showSaturdayAddForm=this.showSaturdayAddForm==true?false:true;
    }
    if(day == "Sunday"){
      this.selectedStartTimeSunday=this.timeSlotList[0].long;
      this.selectedEndTimeSunday=this.timeSlotList[this.timeSlotList.length-1].long;
      this.showSundayAddForm=this.showSundayAddForm==true?false:true;
    }
  }

  fnAddBreak(day){
    this.isLoaderAdmin = true;
    let requestObject={
      "staff_id":'',
      "start_time":'',
      "end_time":'',
      "dayNumber":''
    }
    if(day == "Monday"){
      requestObject={
        "staff_id":this.selectedStaffId ,
        "start_time":this.selectedStartTimeMonday,
        "end_time":this.selectedEndTimeMonday,
        "dayNumber":"1"
      }
      console.log(requestObject);
    }
    if(day == "Tuesday"){
      requestObject={
        "staff_id":this.selectedStaffId ,
        "start_time":this.selectedStartTimeTuesday,
        "end_time":this.selectedEndTimeTuesday,
        "dayNumber":"2"
      }
      console.log(requestObject);
    }
    if(day == "Wednesday"){
      requestObject={
        "staff_id":this.selectedStaffId ,
        "start_time":this.selectedStartTimeWednesday,
        "end_time":this.selectedEndTimeWednesday,
        "dayNumber":"3"
      }
      console.log(requestObject);
    }
    if(day == "Thursday"){
      requestObject={
        "staff_id":this.selectedStaffId ,
        "start_time":this.selectedStartTimeThursday,
        "end_time":this.selectedEndTimeThursday,
        "dayNumber":"4"
      }
      console.log(requestObject);
    }
    if(day == "Friday"){
      requestObject={
        "staff_id":this.selectedStaffId ,
        "start_time":this.selectedStartTimeFriday,
        "end_time":this.selectedEndTimeFriday,
        "dayNumber":"5"
      }
      console.log(requestObject);
    }
    if(day == "Saturday"){
      requestObject={
        "staff_id":this.selectedStaffId ,
        "start_time":this.selectedStartTimeSaturday,
        "end_time":this.selectedEndTimeSaturday,
        "dayNumber":"6"
      }
      console.log(requestObject);
    }
    if(day == "Sunday"){
      requestObject={
        "staff_id":this.selectedStaffId ,
        "start_time":this.selectedStartTimeSunday,
        "end_time":this.selectedEndTimeSunday,
        "dayNumber":"0"
      }
      console.log(requestObject);
    }
    this.adminSettingsService.addNewBreakStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnViewSingleStaff(this.selectedStaffId);
        this.showMondayAddForm=false;
        this.showTuesdayAddForm=false;
        this.showWednesdayAddForm=false;
        this.showThursdayAddForm=false;
        this.showFridayAddForm=false;
        this.showSaturdayAddForm=false;
        this.showSundayAddForm=false;
        this._snackBar.open("Break Added", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['green-snackbar']
        });
      }
      else{
      this.isLoaderAdmin = false;
      this._snackBar.open("Break Not Added", "X", {
        duration: 2000,
        verticalPosition: 'bottom',
        panelClass : ['red-snackbar']
      });
      }
    })
  }

  fnDeleteBreak(breakId){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.isLoaderAdmin = true;
        console.log(breakId);
        let requestObject={
          "staff_id":this.selectedStaffId ,
          "break_id":breakId
        }

        this.adminSettingsService.deleteBreakStaff(requestObject).subscribe((response:any) => {
          if(response.data == true){
            this.fnViewSingleStaff(this.selectedStaffId);
            this._snackBar.open("Break Deleted", "X", {
              duration: 2000,
              verticalPosition: 'bottom',
              panelClass : ['green-snackbar']
            });
          }else{
          this.isLoaderAdmin = false;
          this._snackBar.open("Break Not Deleted", "X", {
            duration: 2000,
            verticalPosition: 'bottom',
            panelClass : ['red-snackbar']
          });
          }
        })
      }
    });
  }

  fnResetToDefaultBreak(){
    this.isLoaderAdmin = true;
    let requestObject={
      "staff_id":this.selectedStaffId ,
      "business_id":this.businessId
    }

    this.adminSettingsService.resetToDefaultBreakStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnViewSingleStaff(this.selectedStaffId);
        this._snackBar.open("Break Reset to Default", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['green-snackbar']
        });
      }else{
      this.isLoaderAdmin = false;
      this._snackBar.open("Break Not Reset to Default", "X", {
        duration: 2000,
        verticalPosition: 'bottom',
        panelClass : ['red-snackbar']
      });
      }
    })
  }

  fnChangeTimeOffStatus(event,timeOffId){
    this.isLoaderAdmin = true;
    console.log(event.checked+"--"+timeOffId);
    let requestObject={
      "staff_id":this.selectedStaffId ,
      "time_off_id":timeOffId,
      "status":event.checked?"E":"D"
    }

    this.adminSettingsService.changeTimeOffStatusStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnViewSingleStaff(this.selectedStaffId);
        this._snackBar.open("TimeOff status updated", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['green-snackbar']
        });
      }else{
      this.isLoaderAdmin = false;
      this._snackBar.open("TimeOff status not updated", "X", {
        duration: 2000,
        verticalPosition: 'bottom',
        panelClass : ['red-snackbar']
      });
      }
    })
  }

  fnResetToDefaultTimeOff(){
    this.isLoaderAdmin = true;
    let requestObject={
      "staff_id":this.selectedStaffId ,
      "business_id":this.businessId
    }

    this.adminSettingsService.resetToDefaultTimeOffStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fnViewSingleStaff(this.selectedStaffId);
        this._snackBar.open("TimeOff status Reset to Default", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['green-snackbar']
        });
      }else{
      this.isLoaderAdmin = false;
      this._snackBar.open("TimeOff status not Reset to Default", "X", {
        duration: 2000,
        verticalPosition: 'bottom',
        panelClass : ['red-snackbar']
      });
      }
    })
  }

  fnDeleteTimeOff(timeOffId){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.isLoaderAdmin = true;
        console.log(timeOffId);
        let requestObject={
          "time_off_id":timeOffId
        }

        this.adminSettingsService.deleteTimeOff(requestObject).subscribe((response:any) => {
          if(response.data == true){
            this.fnViewSingleStaff(this.selectedStaffId);
            this._snackBar.open("TimeOff Deleted", "X", {
              duration: 2000,
              verticalPosition: 'bottom',
              panelClass : ['green-snackbar']
            });
          }else{
            this.isLoaderAdmin = false;
            this._snackBar.open("TimeOff Not Deleted", "X", {
              duration: 2000,
              verticalPosition: 'bottom',
              panelClass : ['red-snackbar']
            });
          }
        })
      }
    });
  }

}
@Component({
  selector: 'new-appointment',
  templateUrl: '../_dialogs/add-new-time-off-dialog.html',
  providers: [DatePipe]
})
export class DialogAddNewTimeOff {
  businessId:any;
  selectedStaffId:any;
  minStartDate = new Date();
  minEndDate = new Date();
  formAddNewTimeOff: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DialogAddNewTimeOff>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private datePipe: DatePipe,
    private _formBuilder: FormBuilder, 
    public adminSettingsService: AdminSettingsService,
    private _snackBar: MatSnackBar) {
    this.formAddNewTimeOff = this._formBuilder.group({
      startDate: [this.minStartDate,Validators.required],
      endDate: ['',Validators.required],
      description: ['',Validators.required],
    });
    if(localStorage.getItem('business_id')){
      this.businessId = localStorage.getItem('business_id');
    }
    this.selectedStaffId=this.data.selectedStaffId;
  }

  fnDateChange(event: MatDatepickerInputEvent<Date>){
    console.log(event);
    this.minEndDate=event.value
  }

  onNoClick(): void {
    this.dialogRef.close({ call: false });
  }

  fnAddNewTimeOff(){
    if(this.formAddNewTimeOff.invalid){
      this.formAddNewTimeOff.get("startDate").markAsTouched();
      this.formAddNewTimeOff.get("endDate").markAsTouched();
      this.formAddNewTimeOff.get("description").markAsTouched();
      return false;
    }
    let requestObject={
      "staff_id":this.selectedStaffId,
      "start_date":this.datePipe.transform(new Date(this.formAddNewTimeOff.get("startDate").value),"yyyy-MM-dd"),
      "end_date":this.datePipe.transform(new Date(this.formAddNewTimeOff.get("endDate").value),"yyyy-MM-dd"),
      "description":this.formAddNewTimeOff.get("description").value
    }
    console.log(JSON.stringify(requestObject));
    this.adminSettingsService.addNewTimeOffStaff(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.dialogRef.close({ call: true });
        this._snackBar.open("TimeOff added", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['green-snackbar']
        });
      }
      else{
       this._snackBar.open("TimeOff not added", "X", {
          duration: 2000,
          verticalPosition: 'bottom',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

}

@Component({
  selector: 'staff-image-upload',
  templateUrl: '../_dialogs/staff-upload-profile-image-dialog.html',
})
export class DialogStaffImageUpload {

  uploadForm: FormGroup;  
  imageSrc: string;
  profileImage: string;
  
constructor(
  public dialogRef: MatDialogRef<DialogStaffImageUpload>,
  private _formBuilder:FormBuilder,
  private _snackBar: MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
      this.dialogRef.close(this.profileImage);
    }
    ngOnInit() {
      this.uploadForm = this._formBuilder.group({
        profile: ['']
      });
    }
    get f() {
      return this.uploadForm.controls;
    }
    
onFileChange(event) {
  const reader = new FileReader();
  if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
          this.imageSrc = reader.result as string;
          this.uploadForm.patchValue({
              fileSource: reader.result
          });
      };
  }
}
uploadImage() {
  this.profileImage = this.imageSrc
  this.dialogRef.close(this.profileImage);
}


}
