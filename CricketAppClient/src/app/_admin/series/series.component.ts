import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Pagination } from 'src/app/models/pagination';
import { series } from 'src/app/models/series';
import { team } from 'src/app/models/team';
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
  teams:team[]=[];
  pagination!: Pagination;
  series!:series;
  buttonText:string="Add";


  constructor(private fb: FormBuilder,private seriesService:SeriesService) { }

  ngOnInit(): void {
    this.intitializeForm();
    this.pageSize=20;
    this.loadSeries();
  }
  intitializeForm()
  {
    this.seriesForm=this.fb.group({
      SeriesName: [''],
      SeriesTypeId: [''],
      StatusName:['Schedule']
    });
  }
  loadSeries() {
    this.seriesService.getSeries(this.pageNumber,this.pageSize).subscribe(response => {
      this.teams = response.result;
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
    this.series=item;
    this.seriesForm.setValue({  
      SeriesName: this.series.seriesName,
      SeriesTypeId: this.series.seriesTypeId,
      StatusName:this.series.statusName
     });  
     this.buttonText="Update";
  }
  OnUpdate()
  {
    this.series.seriesName=this.seriesForm.controls['SeriesName'].value 
    this.series.seriesTypeId=this.seriesForm.controls['SeriesTypeId'].value 
    this.series.statusName=this.seriesForm.controls['StatusName'].value 
    this.seriesService.updateSeries(this.series).subscribe(obj=>{
      this.OnReset();
      this.loadSeries();
   },err=>{
     console.log(err);
   });
  }
  OnReset()
  {
    this.seriesForm.setValue({  
      SeriesName: [''],
      SeriesTypeId: [''],
      StatusName:['Schedule']
     });  
     this.buttonText="Add";
  }
  OnDelete(id:any)
  {
    this.seriesService.deleteSeries(id).subscribe(response => {
      if(response==true)
      {
        this.loadSeries();
      }
    });
  }

  OnSubmit()
  {
    if(this.buttonText=="Add")
    {
    this.seriesService.addSeries(this.seriesForm.value).subscribe(obj=>{
      this.OnReset()
    },err=>{
      console.log(err);
    })
    }
    else{
      this.OnUpdate()
    }
  }
}
