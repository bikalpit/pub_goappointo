import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AdminService } from '../_services/admin-main.service';
import { AppComponent } from '@app/app.component';
import { DatePipe} from '@angular/common';
import { NgbDateParserFormatter, NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { ExportToCsv } from 'export-to-csv';
import { environment } from '@environments/environment';
//import moment from 'moment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [DatePipe]
})
export class ReportsComponent implements OnInit {

  businessId : any;
  selected= {startDate: new Date(), endDate: new Date()};
  selectedStartDate:any;
  selectedStartDateLabel:any;
  selectedEndDate:any;
  selectedEndDateLabel:any;
  dateFilter:any;
  reportFilter:any;
  statusFilter:any;
  createdByFilter:any;
  reportSideMenuToggle : boolean = false;

  appointmentReport : any=[];
  appointmentReportTotalRecords : any;
  appointmentReportExpectedRevenue : any;
  
  salesReport : any=[];
  salesReportTotalRecords : any;
  salesReportConfirmedRevenue : any;
  salesReportProjectedRevenue : any;
  salesReportTotalEstimatedRevenue : any;
  salesReportTotalAppointments : any;
  salesReportCustomers : any;
  salesReportTotalRevenue : any;
  
  customerReport : any;
  search = {
    keyword: ""
  };
  isAppointmentReport : boolean = true;
  isSalesReport : boolean = false;
  isCustomerReport : boolean = false;
  adminSettings: boolean = false;
  isAppointmentsGroupBy:boolean =false;
  isSalesGroupBy:boolean =false;
  searchValue:any;
  AllCustomerReportsList:any;
  CustomerReportsList:any;
  options={
    format: 'MM/DD/YYYY', // could be 'YYYY-MM-DDTHH:mm:ss.SSSSZ'
    displayFormat: 'MM/DD/YYYY', // default is format value
    direction: 'ltr', // could be rtl
    weekLabel: 'W',
    separator: ' To ', // default is ' - '
    cancelLabel: 'Cancel', // detault is 'Cancel'
    applyLabel: 'Apply', // detault is 'Apply'
    clearLabel: 'Clear', // detault is 'Clear'
    customRangeLabel: 'Custom range',
    //daysOfWeek: moment.weekdaysMin(),
   // monthNames: moment.monthsShort(),
    firstDay: 1 // first day is monday
  };
  // ranges: any = {
  //   'Today': [moment(), moment()],
  //   'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
  //   'Last 7 Days': [moment().subtract(6, 'days'), moment()],
  //   'Last 30 Days': [moment().subtract(29, 'days'), moment()],
  //   'This Month': [moment().startOf('month'), moment().endOf('month')],
  //   'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  // };
  settingsArr:any=[];
  currencySymbol:any;
  currencySymbolPosition:any;
  currencySymbolFormat:any;

  appointmentReportApiUrl : any;
  salesReportApiUrl : any;
  customerReportApiUrl : any;
  appointmentReportcurrent_page : any;
  appointmentReportfirst_page_url : any;
  appointmentReportlast_page : any;
  appointmentReportlast_page_url : any;
  appointmentReportnext_page_url : any;
  appointmentReportprev_page_url : any;
  appointmentReportpath : any;
  salesReportcurrent_page : any;
  salesReportfirst_page_url : any;
  salesReportlast_page : any;
  salesReportlast_page_url : any;
  salesReportnext_page_url : any;
  salesReportprev_page_url : any;
  salesReportpath : any;
  customerReportcurrent_page : any;
  customerReportfirst_page_url : any;
  customerReportlast_page : any;
  customerReportlast_page_url : any;
  customerReportnext_page_url : any;
  customerReportprev_page_url : any;
  customerReportpath : any;

  constructor(
    public router: Router,
    private adminService: AdminService,
    private appComponent: AppComponent,
    private datePipe: DatePipe,
    private calendar: NgbCalendar,
    ) {
    if(localStorage.getItem('business_id')){
        this.businessId = localStorage.getItem('business_id');
    }
    this.selectedStartDate=this.datePipe.transform(new Date(),"yyyy-MM-dd");
    this.selectedStartDateLabel=this.datePipe.transform(new Date(),"dd MMM yyyy");
    this.selectedEndDate=this.datePipe.transform(new Date(),"yyyy-MM-dd");
    this.selectedEndDateLabel=this.datePipe.transform(new Date(),"dd MMM yyyy");
    this.dateFilter ="booking_date";
    this.reportFilter ="all";
    this.statusFilter ="all";
    this.createdByFilter ="admin";
  }
  
  ngOnInit() {
    this.appointmentReportApiUrl=environment.apiUrl+"/appointment-reports";
    this.salesReportApiUrl=environment.apiUrl+"/sales-reports";
    this.customerReportApiUrl=environment.apiUrl+"/customer-reports";
    this.fnGetSettings();
    // this.fnGetAppointmentsReport();
    // this.fnGetSalesReport();
    // this.fnGetCustomerReport();
  }

  fnGetSettings(){
    let requestObject = {
      "business_id" : this.businessId
      };

    this.adminService.getSettingValue(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.settingsArr = response.response;
        console.log(this.settingsArr);

        this.currencySymbol = this.settingsArr.currency;
        console.log(this.currencySymbol);
        
        this.currencySymbolPosition = this.settingsArr.currency_symbol_position;
        console.log(this.currencySymbolPosition);
        
        this.currencySymbolFormat = this.settingsArr.currency_format;
        console.log(this.currencySymbolFormat);
      }else{
      }
      },
      (err) =>{
        console.log(err)
      })
  }

  changeDateRange(event){
    this.appointmentReportApiUrl=environment.apiUrl+"/appointment-reports";
    this.salesReportApiUrl=environment.apiUrl+"/sales-reports";
    this.customerReportApiUrl=environment.apiUrl+"/customer-reports";
    if(event.startDate){
      this.selectedStartDate=this.datePipe.transform(new Date(event.startDate._d),"yyyy-MM-dd");
      this.selectedStartDateLabel=this.datePipe.transform(new Date(event.startDate._d),"dd MMM yyyy");
    }
    if(event.endDate){
     this.selectedEndDate=this.datePipe.transform(new Date(event.endDate._d),"yyyy-MM-dd");
     this.selectedEndDateLabel=this.datePipe.transform(new Date(event.endDate._d),"dd MMM yyyy");
    }
    this.fnGetAppointmentsReport();
    this.fnGetSalesReport();
    this.fnGetCustomerReport();
  }

  fnChangeDateFilter(event){
    this.appointmentReportApiUrl=environment.apiUrl+"/appointment-reports"
    this.fnGetAppointmentsReport();
  }

  fnChangeReportFilter(event){
    this.appointmentReportApiUrl=environment.apiUrl+"/appointment-reports";
    this.salesReportApiUrl=environment.apiUrl+"/sales-reports";
    console.log(event);
    if(event.value=="date" || event.value=="month"){
      this.appointmentReport=[];
      this.salesReport=[];
      this.isAppointmentsGroupBy=true;
      this.isSalesGroupBy=true;
    }else{
      this.appointmentReport=[];
      this.salesReport=[];
      this.isAppointmentsGroupBy=false;
      this.isSalesGroupBy=false;
    }
    this.fnGetAppointmentsReport();
    this.fnGetSalesReport();
  }
  fnReportToggleSmall(){
    this.reportSideMenuToggle = true;
  }
  fnReportToggleLarge(){
    this.reportSideMenuToggle = false;
  }

  fnChangeStatusFilter(event){
    this.salesReportApiUrl=environment.apiUrl+"/sales-reports";
    console.log(event);
    this.fnGetSalesReport();
  }

  fnChangeCreatedByFilter(event){
    this.customerReportApiUrl=environment.apiUrl+"/customer-reports";
    console.log(event);
    this.fnGetCustomerReport();
  }

  appointmentReportArrayOne(n: number): any[] {
    return Array(n);
  }

  appointmentReportNavigateTo(api_url){
    this.appointmentReportApiUrl=api_url;
    console.log(this.appointmentReportApiUrl);
    if(this.appointmentReportApiUrl){
      this.fnGetAppointmentsReport();
    }
  }
  appointmentReportNavigateToPageNumber(index){
    this.appointmentReportApiUrl=this.appointmentReportpath+'?page='+index;
    console.log(this.appointmentReportApiUrl);
    if(this.appointmentReportApiUrl){
      this.fnGetAppointmentsReport();
    }
  }

  fnGetAppointmentsReport(){
    let requestObject = {
      'business_id': this.businessId,
      'date_filter': this.dateFilter,
      'report_filter':this.reportFilter,
      'start_date':this.selectedStartDate,
      'end_date': this.selectedEndDate,
      'search': this.search.keyword,
    };
    this.adminService.getAppointmentsReports(requestObject,this.appointmentReportApiUrl).subscribe((response:any) => {
      if(response.data == true){

        this.appointmentReportTotalRecords = response.response[0].TotalRecord;
        this.appointmentReportExpectedRevenue = response.response[0].expectedRevenue;
        this.appointmentReport = response.response[0].list.data;

        this.appointmentReportcurrent_page = response.response[0].list.current_page;
        this.appointmentReportfirst_page_url = response.response[0].list.first_page_url;
        this.appointmentReportlast_page = response.response[0].list.last_page;
        this.appointmentReportlast_page_url = response.response[0].list.last_page_url;
        this.appointmentReportnext_page_url = response.response[0].list.next_page_url;
        this.appointmentReportprev_page_url = response.response[0].list.prev_page_url;
        this.appointmentReportpath = response.response[0].list.path;

        this.appointmentReport.forEach(element=>{
          if(this.reportFilter=="all"){
            element.booking_date=this.datePipe.transform(new Date(element.booking_date),"EEE, dd MMM yyyy");
            element.booking_time=this.datePipe.transform(new Date(element.booking_date+" "+element.booking_time),"hh:mm a");
          }else if(this.reportFilter=="date"){
            element.dates=this.datePipe.transform(new Date(element.dates),"dd MMM yyyy");
          }else{
            element.Month=this.datePipe.transform(new Date(element.Month),"MMM yyyy");
          }
        });
        console.log(this.appointmentReport);
      }
      else if(response.data == false){
        this.appointmentReport = [];
        this.appointmentReportTotalRecords = 0;
        this.appointmentReportExpectedRevenue = 0;
      }
    })
  }

  salesReportArrayOne(n: number): any[] {
    return Array(n);
  }

  salesReportNavigateTo(api_url){
    this.salesReportApiUrl=api_url;
    console.log(this.salesReportApiUrl);
    if(this.salesReportApiUrl){
      this.fnGetSalesReport();
    }
  }
  salesReportNavigateToPageNumber(index){
    this.salesReportApiUrl=this.salesReportpath+'?page='+index;
    console.log(this.salesReportApiUrl);
    if(this.salesReportApiUrl){
      this.fnGetSalesReport();
    }
  }

  fnGetSalesReport(){
    let requestObject = {
      'business_id': this.businessId,
      'status_filter': this.statusFilter,
      'group_filter':this.reportFilter,
      'start_date':this.selectedStartDate,
      'end_date': this.selectedEndDate,
      'search': this.search.keyword,
    };

    this.adminService.getSalesReports(requestObject,this.salesReportApiUrl).subscribe((response:any) => {
      if(response.data == true){
        // this.salesReport = response.response.list;
        this.salesReport = response.response.list.data;

        this.salesReportcurrent_page = response.response.list.current_page;
        this.salesReportfirst_page_url = response.response.list.first_page_url;
        this.salesReportlast_page = response.response.list.last_page;
        this.salesReportlast_page_url = response.response.list.last_page_url;
        this.salesReportnext_page_url = response.response.list.next_page_url;
        this.salesReportprev_page_url = response.response.list.prev_page_url;
        this.salesReportpath = response.response.list.path;
        this.salesReport.forEach(element=>{
          if(this.reportFilter=="all"){
            element.payment_date=this.datePipe.transform(new Date(element.payment_date),"EEE, dd MMM yyyy");
            element.orders.booking_date=this.datePipe.transform(new Date(element.orders.booking_date),"EEE, dd MMM yyyy");
            element.orders.booking_time=this.datePipe.transform(new Date(element.orders.booking_date+" "+element.orders.booking_time),"hh:mm a");
          }else if(this.reportFilter=="date"){
            element.dates=this.datePipe.transform(new Date(element.dates),"dd MMM yyyy");
          }else{
            element.Months=this.datePipe.transform(new Date(element.Months),"MMM yyyy");
          }
        });
        if(this.reportFilter=="all"){
            this.salesReportTotalRecords = response.response.TotalRecords;
            this.salesReportConfirmedRevenue = response.response.ConfirmRevenue;
            this.salesReportProjectedRevenue = response.response.ProjectedRevenue;
            this.salesReportTotalEstimatedRevenue = response.response.TotalEstimated;
          }else if(this.reportFilter=="date" || this.reportFilter=="month"){
            this.salesReportTotalAppointments = response.response.TotalAppointment;
            this.salesReportCustomers = response.response.customers;
            this.salesReportTotalRevenue = response.response.TotalRevenue;
          }else{

          }
        console.log(this.salesReport);
        console.log(this.salesReportTotalRecords);
        console.log(this.salesReportConfirmedRevenue);
        console.log(this.salesReportProjectedRevenue);
        console.log(this.salesReportTotalEstimatedRevenue);
        console.log(this.salesReportTotalAppointments);
        console.log(this.salesReportCustomers);
        console.log(this.salesReportTotalRevenue);
      }
      else if(response.data == false){
        this.salesReport = [];
      }
    })
  }

  customerReportArrayOne(n: number): any[] {
    return Array(n);
  }

  customerReportNavigateTo(api_url){
    this.customerReportApiUrl=api_url;
    console.log(this.customerReportApiUrl);
    if(this.customerReportApiUrl){
      this.fnGetCustomerReport();
    }
  }
  customerReportNavigateToPageNumber(index){
    this.customerReportApiUrl=this.customerReportpath+'?page='+index;
    console.log(this.customerReportApiUrl);
    if(this.customerReportApiUrl){
      this.fnGetCustomerReport();
    }
  }

  fnGetCustomerReport(){
    let requestObject = {
        'business_id': this.businessId,
        'start_date': this.selectedStartDate,
        'end_date':this.selectedEndDate,
        'filter':this.createdByFilter,
        'search': this.search.keyword,
    };
    this.adminService.getCustomerReports(requestObject,this.customerReportApiUrl).subscribe((response:any) => {
      if(response.data == true){
        // this.customerReport = response.response;
        this.customerReport = response.response.data;

        this.customerReportcurrent_page = response.response.current_page;
        this.customerReportfirst_page_url = response.response.first_page_url;
        this.customerReportlast_page = response.response.last_page;
        this.customerReportlast_page_url = response.response.last_page_url;
        this.customerReportnext_page_url = response.response.next_page_url;
        this.customerReportprev_page_url = response.response.prev_page_url;
        this.customerReportpath = response.response.path;
        console.log(this.customerReport);
        this.customerReport.forEach(element=>{
            element.created_at=this.datePipe.transform(new Date(element.created_at),"dd MMM yyyy");
        });
      }
      else if(response.data == false){
        this.customerReport = [];
      }
    })
  }

  fnappointmentReport(){
    this.isAppointmentReport = true;
    this.isSalesReport = false;
    this.isCustomerReport = false;
    this.search.keyword = '';
  }
  fnsalesReport(){
    this.isAppointmentReport = false;
    this.isSalesReport = true;
    this.isCustomerReport = false;
    this.search.keyword = '';
  }
  fncustomerReport(){
    this.isAppointmentReport = false;
    this.isSalesReport = false;
    this.isCustomerReport = true;
    this.search.keyword = '';
  }

  searchReport(){
      this.fnGetAppointmentsReport();
      this.fnGetSalesReport();
      this.fnGetCustomerReport();
  }
  fnPrint(){
    if(this.isAppointmentReport){
      const printContent = document.getElementById("appointment_listing");
      const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
      WindowPrt.document.write(printContent.innerHTML);
      WindowPrt.document.close();
      WindowPrt.focus();
      WindowPrt.print();
    }else if(this.isSalesReport){
      const printContent = document.getElementById("sales_report");
      const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
      WindowPrt.document.write(printContent.innerHTML);
      WindowPrt.document.close();
      WindowPrt.focus();
      WindowPrt.print();
    }else if(this.isCustomerReport){
      const printContent = document.getElementById("customer_report");
      const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
      WindowPrt.document.write(printContent.innerHTML);
      WindowPrt.document.close();
      WindowPrt.focus();
      WindowPrt.print();
    }
    
    // WindowPrt.close();
  }

  downloadRepoer(){ 
    const options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'Reports',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };
    const csvExporter = new ExportToCsv(options);
    if(this.isAppointmentReport && this.appointmentReport != ''){
      csvExporter.generateCsv(this.appointmentReport);
    }else if(this.isSalesReport && this.salesReport != ''){
      csvExporter.generateCsv(this.salesReport);
    }else if(this.isCustomerReport && this.customerReport != ''){
      csvExporter.generateCsv(this.customerReport);
    }
  }


}
