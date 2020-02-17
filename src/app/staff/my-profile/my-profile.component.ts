import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from '@environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { StaffService } from '../_services/staff.service'

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})

export class MyProfileComponent implements OnInit {

  myProfile: FormGroup;
  profiledata : any =[];
 animal: any;
 error:any;
 updatedprofiledata: any =[];

 emailFormat = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
 onlynumeric = /^-?(0|[1-9]\d*)?$/

  constructor(
    public dialog: MatDialog, private http: HttpClient,
    private StaffService: StaffService,
    private _formBuilder: FormBuilder,
    ) { }

  ngOnInit() {

    this.myProfile = this._formBuilder.group({
      user_FirstName : ['', Validators.required],
      user_LastName : ['', Validators.required],
      user_Email : ['', [Validators.required,Validators.email,Validators.pattern(this.emailFormat)]],
      user_Mobile : ['', [Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern(this.onlynumeric)]],
    });

    this.getProfiledata();
  }

  getProfiledata(){
    this.StaffService.getProfiledata().subscribe((response:any) => 
    {
      if(response.data == true){
        this.profiledata = response.response;
        this.myProfile.controls['user_FirstName'].setValue(this.profiledata.firstname);
        this.myProfile.controls['user_LastName'].setValue(this.profiledata.lastname);
        this.myProfile.controls['user_Email'].setValue(this.profiledata.email);
        this.myProfile.controls['user_Mobile'].setValue(this.profiledata.phone);
      }
    },
      (err) => {
        this.error = err;
      }
    )
  }
  onSubmit(event){
    if(this.myProfile.valid){
      this.updatedprofiledata ={
        "staff_id" : "2",
        "firstname" : this.myProfile.get('user_FirstName').value,
        "lastname" : this.myProfile.get('user_LastName').value,
        "email" : this.myProfile.get('user_Email').value,
        "phone" : this.myProfile.get('user_Mobile').value,
      }
      
    this.fnprofilesubmit(this.updatedprofiledata)
    }
  }
  fnprofilesubmit(updatedprofiledata){
    this.StaffService.fnprofilesubmit(updatedprofiledata).subscribe((response:any) => {
      this.profiledata = response.response;
    },
      (err) => {
        this.error = err;
      }
    )
  }
  
     ImgUpload() {
    const dialogRef = this.dialog.open(DialogStaffImageUpload, {
      width: '500px',
    });

     dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
     });
  }

}

@Component({
	  selector: 'image-upload-dialog',
	  templateUrl: 'image-upload-dialog.html',
	})
	export class DialogStaffImageUpload {

	  constructor(
	    public dialogRef: MatDialogRef<DialogStaffImageUpload>,
	    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

	  onNoClick(): void {
	    this.dialogRef.close();
	  }

	}