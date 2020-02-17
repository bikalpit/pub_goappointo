import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HttpClientModule } from '@angular/common/http';
import { ProgressBarModule } from "angular-progress-bar";
import { HighchartsChartModule } from 'highcharts-angular';
import { MaterialModule } from '@app/_helpers/material.module';

import { AdminRoutingModule } from './admin-routing.module';
import { MyBusinessComponent } from './my-business/my-business.component';
import { myCreateNewBusinessDialog } from './my-business';
import { MyWorkSpaceComponent } from './my-work-space/my-work-space.component';
import { myWorkSpaceAcceptDialog } from './my-work-space';

@NgModule({
  declarations: [
    MyBusinessComponent,
    myCreateNewBusinessDialog,
    MyWorkSpaceComponent,
    myWorkSpaceAcceptDialog
    ],
  imports: [
    CommonModule,
    HttpClientModule,
    AdminRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    NgxChartsModule,
    ProgressBarModule,
    HighchartsChartModule
  ],
  exports: [
    FormsModule
  ],
  entryComponents: [myCreateNewBusinessDialog,myWorkSpaceAcceptDialog,],
})
export class AdminModule { }