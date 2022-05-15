import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Pagination } from 'src/app/_models/pagination';
import { series } from 'src/app/_models/series';
import { AppcommonService } from 'src/app/_services/appcommon.service';
import { ConfirmService } from 'src/app/_services/confirm.service';
import { SeriesService } from 'src/app/_services/series.service';
@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.css']
})
export class SeriesComponent implements OnInit {

  seriesForm!: FormGroup;

  pageNumber:number=1;
  pageSize:number=20;
  serieses:series[]=[];
  pagination!: Pagination;
  series!:series;
  buttonText:string="Add";
  minDate:Date=new Date();
  tominDate:Date=new Date();
  
  @ViewChild('seriesModal', { static: false }) modal?: ModalDirective;
  constructor(private fb: FormBuilder,private seriesService:SeriesService,
    private toastr:ToastrService,private confirmService:ConfirmService,
    private appcommonService:AppcommonService) { }

  ngOnInit(): void {
    this.intitializeForm();
    this.pageSize=12;
    this.loadSeries();
  }
  
  onShow()
  {
    this.OnReset();
    this.modal?.show();
  }
  onClose()
  {
     this.OnReset();
     this.modal?.hide();
  }
  getappcommonService(indx:number)
  {
    return this.appcommonService.generateRandom(indx);
  }
  intitializeForm()
  {
    this.seriesForm=this.fb.group({
      SeriesName: ['',[Validators.required, Validators.minLength(3)]],
      location:['',[Validators.required]],
      SeriesTypeId: ['',[Validators.required]],
      startDate:['',[Validators.required]],
      endDate:['',[Validators.required]],
      StatusName:['Schedule',[Validators.required]]
    });
  }
  loadSeries() {
    this.seriesService.getSeries(this.pageNumber,this.pageSize).subscribe(response => {
      this.serieses = response.result;
      this.pagination = response.pagination;
    })
  }
  pageChanged(event: any)
  {
    this.pageNumber=event.page;
    this.loadSeries();
  }  
  OnEdit(item:any)
  {
    this.onShow()
    this.series=item;
    this.seriesForm.setValue({  
      SeriesName: this.series.seriesName,
      SeriesTypeId: this.series.seriesTypeId,
      StatusName:this.series.statusName,
      location:this.series.location,
      startDate:new Date(this.series.startDate!),
      endDate:new Date(this.series.endDate!)
     });  
     this.buttonText="Update";
  }
  OnUpdate()
  {
    this.series.seriesName=this.seriesForm.controls['SeriesName'].value 
    this.series.seriesTypeId=this.seriesForm.controls['SeriesTypeId'].value 
    this.series.statusName=this.seriesForm.controls['StatusName'].value 
    this.series.location=this.seriesForm.controls['location'].value,
    this.series.startDate=this.seriesForm.controls['startDate'].value,
    this.series.endDate=this.seriesForm.controls['endDate'].value
    this.seriesService.updateSeries(this.series).subscribe(obj=>{
      this.toastr.success('Update Tournament', 'Updated successfully !');
      this.OnReset();
      this.onClose();
      this.loadSeries();
   });
  }
  OnReset()
  {
    this.seriesForm.setValue({  
      SeriesName: '',
      location:'',
      SeriesTypeId: "",
      startDate:'',
      endDate:'',
      StatusName:'Schedule'
     });  
     this.buttonText="Add";
  }
  onValueChange(value: Date): void {
    this.tominDate = value;
  }
  OnDelete(id:any)
  {
    this.confirmService.confirm('Confirm delete').subscribe(result => {
      if (result) {
        this.seriesService.deleteSeries(id).subscribe(response => {
          if(response==true)
          {
            this.toastr.success('Removed successfully !','Remove Tournament');
            this.loadSeries();
          }
        });
      }
    })
  }

  OnSubmit()
  {
    if(this.seriesForm.status=='INVALID')
    {
      this.toastr.warning('Enter all the field !')
      return;
    }

    if(this.buttonText=="Add")
    {
       this.seriesService.addSeries(this.seriesForm.value).subscribe(obj=>{
         if(obj=="1")
         {
           this.toastr.success('Added successfully !','Add Tournament');
           this.onClose();
           this.OnReset();
           this.loadSeries();
         }
         else
         {
          this.toastr.error('Tournament exist !','Add Tournament');
         }
       })
    }
    else
    {
      this.OnUpdate()
    }
  }
}
