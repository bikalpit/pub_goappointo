import { Component, OnInit, Inject } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { DatePipe} from '@angular/common';
import { AuthenticationService } from '@app/_services';
import { AdminSettingsService } from '../../_services/admin-settings.service';
import { ConfirmationDialogComponent } from '../../../_components/confirmation-dialog/confirmation-dialog.component';
import { Router, RouterEvent, RouterOutlet } from '@angular/router';



export interface DialogData {
  animal: string;
  name: string;
}
@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  planList:any;
  currentUser:any;
  selectedPlanCode:any;
  settingSideMenuToggle:boolean = false;
  isLoaderAdmin:boolean=false;
  updatedPlan:any;
  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router,
    private authenticationService:AuthenticationService,
    @Inject(AdminSettingsService) public AdminSettingsService: AdminSettingsService,
  ) { 
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if(this.currentUser.plan){
      this.selectedPlanCode = this.currentUser.plan.plan_id
    }
  }

  ngOnInit() {
    this.getSubscriptionPlans();
  }

  fnSettingMenuToggleSmall(){
    this.settingSideMenuToggle = true;
  }
  fnSettingMenuToggleLarge(){
    this.settingSideMenuToggle = false;
  }

  getSubscriptionPlans(){
    this.isLoaderAdmin=true;
    let requestObject = {
    }
    this.AdminSettingsService.getSubscriptionPlans(requestObject).subscribe((response:any) => {
      if(response.data == true){
      this.planList = response.response
      this.planList.forEach( (element) => { 
        if(element.plan_id===this.selectedPlanCode){
          element.selected = true;
        }else{
          element.selected = false;
        }
      });
    } else if(response.data == false && response.response !== 'api token or userid invaild'){
      this._snackBar.open(response.response, "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: ['red-snackbar']
        });
    }
    });
  this.isLoaderAdmin=false;
}

  fnChangePlan(planId) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure you want to delete?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.isLoaderAdmin = true;
        let requestObject = {
          'user_id': this.currentUser.user_id,
          'plan_id':planId
        }
        this.AdminSettingsService.fnChangePlan(requestObject).subscribe((response:any) => {
          if(response.data == true){
            this.updatedPlan= response.response;
            this.currentUser.currentPlan = this.updatedPlan;
            this.currentUser.plan = this.updatedPlan.plan;
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this._snackBar.open("Plan Updated.", "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: ['green-snackbar']
            });
            
          this.getSubscriptionPlans();
          
          }else if(response.data == false && response.response !== 'api token or userid invaild'){
            this._snackBar.open(response.response, "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: ['red-snackbar']
          });
        }
      });
      this.isLoaderAdmin=false;
    }
});
  }

  fnCancelPlane(){
    
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you you want to cancel current plan ?"
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result){
        let requestObject = {
          'user_id' : this.currentUser.user_id,
        }
        this.AdminSettingsService.cancelSubscriptionPlans(requestObject).subscribe((response:any) => {
          if(response.data == true){
            this.authenticationService.logout();
            this.router.navigate(['/login']);
            return false;
          } else if(response.data == false && response.response !== 'api token or userid invaild'){
            this._snackBar.open(response.response, "X", {
              duration: 2000,
              verticalPosition: 'top',
              panelClass: ['red-snackbar']
            });
          }
        });
      }
      
    });


  }
}
