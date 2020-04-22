import { Component, OnInit, Inject, Pipe, PipeTransform  } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { AdminSettingsService } from '../_services/admin-settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DomSanitizer} from "@angular/platform-browser";


export interface DialogData {
  animal: string;
  name: string;
  
}
@Pipe({
  name: 'safeHtml',
})

@Component({
  selector: 'app-alertsettings',
  templateUrl: './alertsettings.component.html',
  styleUrls: ['./alertsettings.component.scss']
})
export class AlertsettingsComponent implements OnInit {

  businessId : any;
  emailCustomerAppointment = {
    booked:{
      status:0,
    },
    status_updated:{
      status:0,
    },
    cancelled:{
      status:0
    },
  };
  emailStaffAppointment = {
    booked:{
      status:0,
    },
    status_updated:{
      status:0,
    },
    cancelled:{
      status:0
    },
  };
  emailAdminAppointment = {
    booked:{
      status:0,
    },
    status_updated:{
      status:0,
    },
    cancelled:{
      status:0
    },
  };
  smsAppointment = {
    booked:{
      status:0,
    },
    status_updated:{
      status:0,
    },
    cancelled:{
      status:0
    },
  };
  smsAlertWho = {
    admin:{
      status:0,
    },
    staff:{
      status:0,
    },
    customer:{
      status:0
    },
  };
  emailAlertCustomer : any;
  emailAlertCustomerDays: any;
  emailAlertCustomerHours: any;
  emailAlertCustomerMinutes: any;
  emailAlertStaff: any;
  emailAlertStaffDays: any;
  emailAlertStaffHours: any;
  emailAlertStaffMinutes: any;
  emailAlertAdmin: any;
  emailAlertAdminDays: any;
  emailAlertAdminHours: any;
  emailAlertAdminMinutes: any;
  smsAlertDays: any;
  smsAlertHours: any;
  smsAlertMinutes: any;
  Months:any;
  Days:any;
  Hours:any;
  Minutes:any;
  adminSettings : boolean = true;
  isLoaderAdmin : boolean = false;
  appointmentsReminder : boolean = false;
  appointmentsReminderStaff :boolean = false;
  appointmentsReminderAdmin :boolean = false;
  appointmentsReminderSMS : boolean = false;
  totalTimeCustomerEmail:any;
  totalTimeStaffEmail: any;
  totalTimeAdminEmail: any;
  totalTimeSms: any;
  customerEmailTemData: any;
  adminEmailTemData: any;
  staffEmailTemData: any;
  customizeEmailAlertData: any;
  adminEmailForAlert: FormGroup;
  customizeAlert: FormGroup;
  cusEmailTemplate1: FormGroup;
  cusEmailTemplate2: FormGroup;
  cusEmailTemplate3: FormGroup;
  cusEmailTemplate4: FormGroup;
  cusEmailTemplate5: FormGroup;
  cusEmailTemplate6: FormGroup;
  cusEmailTemplate7: FormGroup;
  adminEmailTemplate1: FormGroup;
  adminEmailTemplate2: FormGroup;
  adminEmailTemplate3: FormGroup;
  adminEmailTemplate4: FormGroup;
  adminEmailTemplate5: FormGroup;
  adminEmailTemplate6: FormGroup;
  adminEmailTemplate7: FormGroup;
  staffEmailTemplate1: FormGroup;
  staffEmailTemplate2: FormGroup;
  staffEmailTemplate3: FormGroup;
  staffEmailTemplate4: FormGroup;
  staffEmailTemplate5: FormGroup;
  staffEmailTemplate6: FormGroup;
  staffEmailTemplate7: FormGroup;
  admintomerEmailTemp1: any;
  smsAlertsSetting: any;
  emailTempStatus: any;
  maxCharacters = 500; 
  characters = this.maxCharacters;
  cusEmailTempl : any;
  constructor(
    private appComponent : AppComponent,
    public adminSettingsService : AdminSettingsService,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    ) {
      if(localStorage.getItem('business_id')){
        this.businessId = localStorage.getItem('business_id');
      }

      this.emailAlertCustomerDays = "0";
      this.emailAlertCustomerHours= "0";
      this.emailAlertCustomerMinutes= "0";
      this.emailAlertStaffDays = "0";
      this.emailAlertStaffHours= "0";
      this.emailAlertStaffMinutes= "0";
      this.emailAlertAdminDays = "0";
      this.emailAlertAdminHours= "0";
      this.emailAlertAdminMinutes= "0";
    }
     

  ngOnInit() {
    this.getSettingsValue();
    this.getCustomerEmailTemplates();
    this.getAdminEmailTemplates();
    this.getStaffEmailTemplates();
    let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
    this.adminEmailForAlert = this._formBuilder.group({
      alertEmail: ['',[Validators.required,Validators.email,Validators.pattern(emailPattern)]]
    });

    this.customizeAlert = this._formBuilder.group({
      senderName: ['',[Validators.required]],
      emailSignature: ['',[Validators.required]]
    });

    // Email Templates
    this.cusEmailTemplate1 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.cusEmailTemplate2 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.cusEmailTemplate3 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.cusEmailTemplate4 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.cusEmailTemplate5 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.cusEmailTemplate6 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.cusEmailTemplate7 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });

    this.adminEmailTemplate1 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.adminEmailTemplate2 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.adminEmailTemplate3 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.adminEmailTemplate4 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.adminEmailTemplate5 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.adminEmailTemplate6 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.adminEmailTemplate7 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });

    this.staffEmailTemplate1 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.staffEmailTemplate2 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.staffEmailTemplate3 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.staffEmailTemplate4 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.staffEmailTemplate5 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.staffEmailTemplate6 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
    this.staffEmailTemplate7 = this._formBuilder.group({
      emailTemplate: ['',[Validators.required]]
    });
 
  } 
  count(value: string){
    this.characters = this.maxCharacters - value.length;
  }

  fnConvertMins(minutes){
    let min_advance_booking_time=minutes;
    let months = (min_advance_booking_time/(30*24*60)).toString();
    this.Months=(parseInt(months)).toString();
    let RAM = min_advance_booking_time%(30*24*60);
    let days = (RAM/(24*60)).toString();
    this.Days=(parseInt(days)).toString();
    let RAD = RAM%(24*60);
    let hours= (RAD/60).toString();
    this.Hours=(parseInt(hours)).toString();
    let RAH = (RAD%(60)).toString();
    this.Minutes=(parseInt(RAH)).toString();
  }

  getSettingsValue(){
  this.adminSettingsService.getSettingsValue().subscribe((response:any) => {
      if(response.data == true){
        console.log(response.response)
        this.emailAlertCustomer = JSON.parse(response.response.email_alert_settings_customer)
        this.fnConvertMins(this.emailAlertCustomer.reminder_lead_time);
          this.emailAlertCustomerDays=this.Days;
          this.emailAlertCustomerHours=this.Hours;
          this.emailAlertCustomerMinutes=this.Minutes;
          this.appointmentsReminder = this.emailAlertCustomer.status;
          this.emailCustomerAppointment =  JSON.parse(this.emailAlertCustomer.appointment);
          this.emailAlertStaff = JSON.parse(response.response.email_alert_settings_staff)
          this.fnConvertMins(this.emailAlertStaff.reminder_lead_time);
          this.emailAlertStaffDays=this.Days;
          this.emailAlertStaffHours=this.Hours;
          this.emailAlertStaffMinutes=this.Minutes;
          this.appointmentsReminderStaff = this.emailAlertStaff.status;
          this.emailStaffAppointment =  JSON.parse(this.emailAlertStaff.appointment);
          this.emailAlertAdmin = JSON.parse(response.response.email_alert_settings_admin)
          this.fnConvertMins(this.emailAlertAdmin.reminder_lead_time);
          this.emailAlertAdminDays=this.Days;
          this.emailAlertAdminHours=this.Hours;
          this.emailAlertAdminMinutes=this.Minutes;
          this.appointmentsReminderAdmin = this.emailAlertAdmin.status;
          if(this.emailAlertAdmin.admin_mail){
           this.adminEmailForAlert.controls['alertEmail'].setValue(this.emailAlertAdmin.admin_mail);
          }
          this.emailAdminAppointment =  JSON.parse(this.emailAlertAdmin.appointment);
          
          this.customizeEmailAlertData = JSON.parse(response.response.customize_email_alert)
          console.log(this.customizeEmailAlertData);
          if(this.customizeEmailAlertData){
            this.customizeAlert.controls['senderName'].setValue(this.customizeEmailAlertData.sender_name);
            this.customizeAlert.controls['emailSignature'].setValue(this.customizeEmailAlertData.email_signature);
          }
          this.emailAlertCustomer = JSON.parse(response.response.email_alert_settings_customer)
          this.smsAlertsSetting = JSON.parse(response.response.sms_sending_settings)
          console.log(this.smsAlertsSetting);
          this.fnConvertMins(this.smsAlertsSetting.time);
          this.smsAlertDays=this.Days;
          this.smsAlertHours=this.Hours;
          this.smsAlertMinutes=this.Minutes;
          this.appointmentsReminderSMS = this.smsAlertsSetting.reminder_status;
          this.smsAppointment = JSON.parse(this.smsAlertsSetting.when);
          this.smsAlertWho = JSON.parse(this.smsAlertsSetting.who);

      }
      else{
       
      }
    })
  }
fnAppointmentsReminder(event){
    if(event == true){
      this.appointmentsReminder = true;
    }else if(event == false){
      this.appointmentsReminder = false;
    }
    let customerAlertSetting = {
      "reminder_lead_time" : this.totalTimeCustomerEmail,
      "appointment" : JSON.stringify(this.emailCustomerAppointment),
      "status":this.appointmentsReminder,
    }
    let requestObject={
      "business_id":this.businessId,
      "status":this.appointmentsReminder,
      "email_alert_settings_customer" : customerAlertSetting
    }
    console.log(requestObject);
    this.fnUpdateCusEmailAlert(requestObject);
    
}

fnAppointmentsReminderStaff(event){
    if(event == true){
      this.appointmentsReminderStaff = true;
    }else if(event == false){
      this.appointmentsReminderStaff = false;
    }
    let staffAlertSetting = {
      "reminder_lead_time" : this.totalTimeStaffEmail,
      "appointment" : JSON.stringify(this.emailStaffAppointment),
      "status":this.appointmentsReminderStaff,
    }
    let requestObject={
      "business_id":this.businessId,
      "status":this.appointmentsReminderStaff,
      "email_alert_settings_staff" : staffAlertSetting
    }
    console.log(requestObject);
    this.fnUpdateStaffEmailAlert(requestObject);
  }
  fnAppointmentsReminderAdmin(event){
    if(event == true){
      this.appointmentsReminderAdmin = true;
    }else if(event == false){
      this.appointmentsReminderAdmin = false;
    }
    let adminAlertSetting = {
      "reminder_lead_time" : this.totalTimeAdminEmail,
      "appointment" : JSON.stringify(this.emailAdminAppointment),
      "status":this.appointmentsReminderAdmin,
    }
    let requestObject={
      "business_id":this.businessId,
      "status":this.appointmentsReminderAdmin,
      "email_alert_settings_admin" : adminAlertSetting
    }
    console.log(requestObject);
    this.fnUpdateAdminEmailAlert(requestObject);
  }

fnAppointmentsReminderSMS(event){
    if(event == true){
      this.appointmentsReminderSMS = true;
    }else if(event == false){
      this.appointmentsReminderSMS = false;
    }
    let smsAlertSetting = {
      "time" : this.totalTimeSms,
      "when" : JSON.stringify(this.smsAppointment),
      "reminder_status":this.appointmentsReminderSMS,
      "who":JSON.stringify(this.smsAlertWho),
    }
    let requestObject={
      "business_id":this.businessId,
      "reminder_status":this.appointmentsReminderSMS,
      "sms_sending_settings" : smsAlertSetting
    }
    console.log(requestObject);
    this.fnUpdateSmsAlert(requestObject);
  }

  fnCusEmailAppoint(event, value){
    if(event == true){
      this.emailCustomerAppointment[value].status=1;
    }else{
      this.emailCustomerAppointment[value].status=0;
    }
    console.log(this.emailCustomerAppointment);
  }
  fnStaffEmailAppoint(event, value){
    if(event == true){
      this.emailStaffAppointment[value].status=1;
    }else{
      this.emailStaffAppointment[value].status=0;
    }
    console.log(this.emailStaffAppointment);
  }
  fnAdminEmailAppoint(event, value){
    if(event == true){
      this.emailAdminAppointment[value].status=1;
    }else{
      this.emailAdminAppointment[value].status=0;
    }
    console.log(this.emailAdminAppointment);
  }

  fnSetCustomerEmailReminderTime(event){
    let email_alert_customer_days=0;
    let email_alert_customer_hours=0;
    let email_alert_customer_minutes=0;
    if(this.emailAlertCustomerDays !=undefined){
     email_alert_customer_days =  parseInt(this.emailAlertCustomerDays)*24*60;
    }
    if(this.emailAlertCustomerHours !=undefined){
     email_alert_customer_hours =  parseInt(this.emailAlertCustomerHours)*60;
    }
    if(this.emailAlertCustomerMinutes !=undefined){
     email_alert_customer_minutes =  parseInt(this.emailAlertCustomerMinutes);
    }
    this.totalTimeCustomerEmail=email_alert_customer_days+email_alert_customer_hours+email_alert_customer_minutes;
    console.log(this.totalTimeCustomerEmail);

  }
  fnSubmitCusEmailAlert(){
    let customerAlertSetting = {
      "reminder_lead_time" : this.totalTimeCustomerEmail,
      "appointment" : JSON.stringify(this.emailCustomerAppointment),
      "status":this.appointmentsReminder,
    }
    let requestObject={
      "business_id":this.businessId,
      "status":this.appointmentsReminder,
      "email_alert_settings_customer" : customerAlertSetting
    }
    console.log(requestObject);
    this.fnUpdateCusEmailAlert(requestObject);
  }
  fnUpdateCusEmailAlert(requestObject){
    this.isLoaderAdmin = true;
    this.adminSettingsService.fnAppointmentsReminderCustomer(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Email alerts for the Customer are Updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.getSettingsValue();
      }
      else{
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }

  fnSetStaffEmailReminderTime(){
    let email_alert_staff_days=0;
    let email_alert_staff_hours=0;
    let email_alert_staff_minutes=0;
    if(this.emailAlertStaffDays !=undefined){
     email_alert_staff_days =  parseInt(this.emailAlertStaffDays)*24*60;
    }
    if(this.emailAlertStaffHours !=undefined){
     email_alert_staff_hours =  parseInt(this.emailAlertStaffHours)*60;
    }
    if(this.emailAlertStaffMinutes !=undefined){
     email_alert_staff_minutes =  parseInt(this.emailAlertStaffMinutes);
    }
    this.totalTimeStaffEmail=email_alert_staff_days+email_alert_staff_hours+email_alert_staff_minutes;
    console.log(this.totalTimeStaffEmail);
  }
  fnSubmitStaffEmailAlert(){
    let staffAlertSetting = {
      "reminder_lead_time" : this.totalTimeStaffEmail,
      "appointment" : JSON.stringify(this.emailStaffAppointment),
      "status":this.appointmentsReminderStaff,
    }
    let requestObject={
      "business_id":this.businessId,
      "status":this.appointmentsReminderStaff,
      "email_alert_settings_staff" : staffAlertSetting
    }
    console.log(requestObject);
    this.fnUpdateStaffEmailAlert(requestObject);
  }

  fnUpdateStaffEmailAlert(requestObject){
    this.isLoaderAdmin = true;
    this.adminSettingsService.fnUpdateStaffEmailAlert(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Email alerts for the Staff are Updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.getSettingsValue();
      }
      else{
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }

  fnSetAdminEmailReminderTime(event){
    let email_alert_admin_days=0;
    let email_alert_admin_hours=0;
    let email_alert_admin_minutes=0;
    if(this.emailAlertAdminDays !=undefined){
     email_alert_admin_days =  parseInt(this.emailAlertAdminDays)*24*60;
    }
    if(this.emailAlertAdminHours !=undefined){
     email_alert_admin_hours =  parseInt(this.emailAlertAdminHours)*60;
    }
    if(this.emailAlertAdminMinutes !=undefined){
     email_alert_admin_minutes =  parseInt(this.emailAlertAdminMinutes);
    }
    this.totalTimeAdminEmail=email_alert_admin_days+email_alert_admin_hours+email_alert_admin_minutes;
    console.log(this.totalTimeAdminEmail);

  }
  fnSubmitAdminEmailAlert(){
    if(this.adminEmailForAlert.valid){ 
      let adminAlertSetting = {
        "reminder_lead_time" : this.totalTimeAdminEmail,
        "appointment" : JSON.stringify(this.emailAdminAppointment),
        "status":this.appointmentsReminderAdmin,
        "admin_mail": this.adminEmailForAlert.get('alertEmail').value
      }
      let requestObject={
        "business_id":this.businessId,
        "status":this.appointmentsReminderAdmin,
        "email_alert_settings_admin" : adminAlertSetting
      }
      console.log(requestObject);
      this.fnUpdateAdminEmailAlert(requestObject);
    }
    // else{
    //   setTimeout(() => this.adminEmailForAlert.focus(), 0);
    //   //this.adminEmailForAlert.controls['alertEmail'].focus();
    // }
   
  }
  fnUpdateAdminEmailAlert(requestObject){
    this.isLoaderAdmin = true;
    this.adminSettingsService.fnUpdateAdminEmailAlert(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Email alerts for the Admin are Updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.getSettingsValue();
      }
      else{
       this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }

  fnSubmitCustomizeAlert(){
    this.isLoaderAdmin = true;
    if(this.customizeAlert.valid){
      let customizeEmailAlert = {
        "sender_name" : this.customizeAlert.get('senderName').value,
        "email_signature" : this.customizeAlert.get('emailSignature').value,
      }
      let requestObject={
        "business_id":this.businessId,
        "customize_email_alert" : customizeEmailAlert
      }

      this.adminSettingsService.fnSubmitCustomizeAlert(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Customize Email alerts are Updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.getSettingsValue();
      }
      else{
       this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
    }
  }

  getCustomerEmailTemplates(){
    let requestObject={
      "business_id":this.businessId,
      "user_type" : "C"
    }
    this.adminSettingsService.getEmailTemplates(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.customerEmailTemData = response.response;
        this.cusEmailTemplate1.controls['emailTemplate'].setValue(this.customerEmailTemData[0].email_message);
        this.cusEmailTemplate2.controls['emailTemplate'].setValue(this.customerEmailTemData[1].email_message);
        this.cusEmailTemplate3.controls['emailTemplate'].setValue(this.customerEmailTemData[2].email_message);
        this.cusEmailTemplate4.controls['emailTemplate'].setValue(this.customerEmailTemData[3].email_message);
        this.cusEmailTemplate5.controls['emailTemplate'].setValue(this.customerEmailTemData[4].email_message);
        this.cusEmailTemplate6.controls['emailTemplate'].setValue(this.customerEmailTemData[5].email_message);
        this.cusEmailTemplate7.controls['emailTemplate'].setValue(this.customerEmailTemData[6].email_message);
      }
      else{
      this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }
  fnChangeTemStatus(event, tempId){
    if(event == true){
      this.emailTempStatus = "E";
    }else{
      this.emailTempStatus = "D";
    }
    let requestObject = {
      "template_id" : tempId,
      "status" : this.emailTempStatus
    }
    this.adminSettingsService.fnChangeTemStatus(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Email Template Status Updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
      }
      else{
      this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }
  fnSaveEmailTemp(tempId){
    alert(tempId);
    console.log(this.cusEmailTempl)
    if(tempId == '59'){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Request",
        "message" : this.cusEmailTemplate1.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == '58'){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Approved",
        "message" : this.cusEmailTemplate2.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == '57'){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Regected",
        "message" : this.cusEmailTemplate3.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == '56'){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment cancelled By You",
        "message" : this.cusEmailTemplate4.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == '55'){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Rescheduled By You",
        "message" : this.cusEmailTemplate5.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == '54'){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Client Appintment Reminder",
        "message" : this.cusEmailTemplate6.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == '53'){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Completed",
        "message" : this.cusEmailTemplate7.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == '66'){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "New Appointment Request Require Approval",
        "message" : this.adminEmailTemplate1.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == '65'){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Approved",
        "message" : this.adminEmailTemplate2.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == '64'){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Rejected",
        "message" : this.adminEmailTemplate3.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == '63'){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Cancelled by Customer",
        "message" : this.adminEmailTemplate4.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == '62'){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment rescheduled by Customer",
        "message" : this.adminEmailTemplate5.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == '61'){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Admin Appointment Reminder",
        "message" : this.adminEmailTemplate6.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == '60'){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Completed",
        "message" : this.adminEmailTemplate7.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == '73'){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "New Appointment Assigned",
        "message" : this.staffEmailTemplate1.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == '72'){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Approved",
        "message" : this.staffEmailTemplate2.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == '71'){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Rejected",
        "message" : this.staffEmailTemplate3.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == '70'){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Cancelled By Customer",
        "message" : this.staffEmailTemplate4.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == '69'){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Rescheduled By Customer",
        "message" : this.staffEmailTemplate5.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == '68'){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Reminder",
        "message" : this.staffEmailTemplate6.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }else if(tempId == '67'){
      let requestObject = {
        "template_id" : tempId,
        "subject" : "Appointment Completed",
        "message" : this.staffEmailTemplate7.get('emailTemplate').value
      }
      this.fnUpdateEmailTemp(requestObject);
    }
  }
  fnUpdateEmailTemp(requestObject){
    this.adminSettingsService.fnUpdateEmailTemp(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Email Template is Updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.getSettingsValue();
        this.getCustomerEmailTemplates();
        this.getAdminEmailTemplates();
        this.getStaffEmailTemplates();
      }
      else{
      this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }


  getAdminEmailTemplates(){
    let requestObject={
      "business_id":this.businessId,
      "user_type" : "A"
    }
    this.adminSettingsService.getEmailTemplates(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.adminEmailTemData = response.response;
        this.adminEmailTemplate1.controls['emailTemplate'].setValue(this.adminEmailTemData[0].email_message);
        this.adminEmailTemplate2.controls['emailTemplate'].setValue(this.adminEmailTemData[1].email_message);
        this.adminEmailTemplate3.controls['emailTemplate'].setValue(this.adminEmailTemData[2].email_message);
        this.adminEmailTemplate4.controls['emailTemplate'].setValue(this.adminEmailTemData[3].email_message);
        this.adminEmailTemplate5.controls['emailTemplate'].setValue(this.adminEmailTemData[4].email_message);
        this.adminEmailTemplate6.controls['emailTemplate'].setValue(this.adminEmailTemData[5].email_message);
        this.adminEmailTemplate7.controls['emailTemplate'].setValue(this.adminEmailTemData[6].email_message);
        console.log(this.adminEmailTemData)
      }
      else{
      this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }
  getStaffEmailTemplates(){
    let requestObject={
      "business_id":this.businessId,
      "user_type" : "S"
    }
    this.adminSettingsService.getEmailTemplates(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.staffEmailTemData = response.response;
        this.staffEmailTemplate1.controls['emailTemplate'].setValue(this.staffEmailTemData[0].email_message);
        this.staffEmailTemplate2.controls['emailTemplate'].setValue(this.staffEmailTemData[1].email_message);
        this.staffEmailTemplate3.controls['emailTemplate'].setValue(this.staffEmailTemData[2].email_message);
        this.staffEmailTemplate4.controls['emailTemplate'].setValue(this.staffEmailTemData[3].email_message);
        this.staffEmailTemplate5.controls['emailTemplate'].setValue(this.staffEmailTemData[4].email_message);
        this.staffEmailTemplate6.controls['emailTemplate'].setValue(this.staffEmailTemData[5].email_message);
        this.staffEmailTemplate7.controls['emailTemplate'].setValue(this.staffEmailTemData[6].email_message);
        console.log(this.staffEmailTemData)
      }
      else{
      this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }

  fnDefaultEmailTemp(tempId){
    let requestObject={
      "business_id":this.businessId,
      "template_id" : tempId
    }
    this.adminSettingsService.fnDefaultEmailTemp(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Email Template is Updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.getSettingsValue();
        this.getCustomerEmailTemplates();
        this.getAdminEmailTemplates();
        this.getStaffEmailTemplates();
      }
      else{
      this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
    })
  }


  
  previewClientEmailTemp(index) {
    const dialogRef = this.dialog.open(DialogPreviewEmailTemp, {
      height: '700px',
      data :{fulldata : this.customerEmailTemData[index]}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  
  previewAdminEmailTemp(index) {
    const dialogRef = this.dialog.open(DialogPreviewEmailTemp, {
      height: '700px',
      data :{fulldata : this.adminEmailTemData[index]}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  previewStaffEmailTemp(index) {
    const dialogRef = this.dialog.open(DialogPreviewEmailTemp, {
      height: '700px',
      data :{fulldata : this.staffEmailTemData[index]}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


// for SMS
  fnSetSmsReminderTime(event){
    let sms_alert_days=0;
    let sms_alert_hours=0;
    let sms_alert_minutes=0;
    if(this.smsAlertDays !=undefined){
      sms_alert_days =  parseInt(this.smsAlertDays)*24*60;
    }
    if(this.smsAlertHours !=undefined){
      sms_alert_hours =  parseInt(this.smsAlertHours)*60;
    }
    if(this.smsAlertMinutes !=undefined){
      sms_alert_minutes =  parseInt(this.smsAlertMinutes);
    }
    this.totalTimeSms=sms_alert_days+sms_alert_hours+sms_alert_minutes;
    console.log(this.totalTimeSms);

  }


  fnSmsAppoint(event, value){
    if(event == true){
      this.smsAppointment[value].status=1;
    }else{
      this.smsAppointment[value].status=0;
    }
    console.log(this.smsAppointment);
  }
  fnSmsWho(event, value){
    if(event == true){
      this.smsAlertWho[value].status=1;
    }else{
      this.smsAlertWho[value].status=0;
    }
    console.log(this.smsAppointment);
  }

  fnSubmitSmsAlert(){
      let smsAlertSetting = {
        "time" : this.totalTimeSms,
        "when" : JSON.stringify(this.smsAppointment),
        "reminder_status":this.appointmentsReminderSMS,
        "who":JSON.stringify(this.smsAlertWho),
      }
      let requestObject={
        "business_id":this.businessId,
        "reminder_status":this.appointmentsReminderSMS,
        "sms_sending_settings" : smsAlertSetting
      }
      console.log(requestObject);
      this.fnUpdateSmsAlert(requestObject);
  }

  fnUpdateSmsAlert(requestObject){
    this.isLoaderAdmin = true;
    this.adminSettingsService.fnUpdateSmsAlert(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this._snackBar.open("Sms alerts are Updated", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['green-snackbar']
        });
        this.getSettingsValue();
      }
      else{
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
      this.isLoaderAdmin = false;
    })
  }


}






@Component({
  selector: 'dialog-preview-email-template',
  templateUrl: '../_dialogs/dialog-preview-email-template.html',
})
export class DialogPreviewEmailTemp  implements PipeTransform {

  businessId :any
  emailTemplate :any
  safeHtmlTemp :any
  constructor(
    public dialogRef: MatDialogRef<DialogPreviewEmailTemp>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public adminSettingsService: AdminSettingsService,
    private sanitizer:DomSanitizer
    ) {
      this.emailTemplate =  this.data.fulldata.email_message;
      this.transform(this.emailTemplate)

    if(localStorage.getItem('business_id')){
      this.businessId = localStorage.getItem('business_id');
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  transform(emailTemplate) {
    this.safeHtmlTemp =  this.sanitizer.bypassSecurityTrustHtml(emailTemplate);
  }
}


