import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { match } from 'src/app/_models/match';
import { series } from 'src/app/_models/series';
import { team } from 'src/app/_models/team';
import { AppcommonService } from 'src/app/_services/appcommon.service';
import { ConfirmService } from 'src/app/_services/confirm.service';
import { MatchesService } from 'src/app/_services/matches.service';
import { SeriesService } from 'src/app/_services/series.service';
import { SquadService } from 'src/app/_services/squad.service';
import { TeamsServiceService } from 'src/app/_services/teams-service.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {

  constructor(private matches:MatchesService,private router:Router,private seriesService:SeriesService,
    private appcommonService:AppcommonService,private squadService:SquadService,
    private toastr:ToastrService,private confirmService:ConfirmService,
    private fb: FormBuilder,private matchService:MatchesService) { }
  
  matchForm!: FormGroup;
  serieses:series[]=[];
  selectedSeries:series={}
  originalTeam:team[]=[];
  selectedTeamList:team[]=[];
  selectedTeam!:team;
  matchTypeList!:any[];
  
  savebuttonText='Save Fixture';
  startbuttonText='Start Match';
  isDeleted:boolean=false;
  minDate:Date=new Date();
  ismatchstart:boolean=true;
  match:match={};
  matchList:match[]=[];

  @ViewChild('matchModal', { static: false }) modal?: ModalDirective;
  ngOnInit(): void {
    this.intitializeForm();
    this.loadSeries();
  }
  getMatchType(seriesType:number)
  {
    this.matchTypeList=this.matchService.getMatchType(seriesType);
  }
  intitializeForm()
  {
    this.matchForm=this.fb.group({
      matchName: ['',[Validators.required, Validators.minLength(3)]],
      matchType: ['',[Validators.required]],
      location:['',[Validators.required]],
      homeTeam:['',[Validators.required]],
      visitingTeam:['',[Validators.required]],
      startDate:['',[Validators.required]]
    });
  }
  loadSeries()
  {
    this.seriesService.getSeries(0,1000).subscribe(response => {
       this.serieses=response.result;
       this.serieses=this.serieses.filter(x=>x.statusName=="Schedule"||x.statusName=="Ongoing");
    });
  }
  getMatches(seriesId:number)
  {
    this.matchService.getMatch(1,20,seriesId).subscribe(res=>{
      this.matchList=res.result;
    })
  }
  onShow()
  {
    this.modal?.show();
  }
  onClose()
  {
    this.modal?.hide();
  }
  onSeriesSelect(series:series)
  {
      this.selectedSeries=series;
      this.loadSeriesTeam(series.seriesId!);
      this.getMatchType(series.seriesTypeId!);
      this.getMatches(series.seriesId!)
  }
  getappcommonService(indx:number)
  {
    return this.appcommonService.generateRandom(indx);
  }

  loadSeriesTeam(seriesId:number)
  {
    this.squadService.getSquad(seriesId).subscribe(result => {
      result.forEach((element, index) => { this.originalTeam.push(JSON.parse(element.teams)); });
     });
  }
  onStart(item:match)
  {
    this.router.navigate(['addmatchplayers',item.matchId]);  
  }
  onAddMatch()
  {
    this.onShow();
  }
  onMatchStart(operation:string)
  {
    if(this.matchForm.status=='INVALID')
    {
      this.toastr.warning('Enter all the field !')
      return;
    }
    else if(this.selectedSeries.seriesId==null)
    {
      this.toastr.warning('Select a series !')
      return;
    }
    else if(this.matchForm.controls['homeTeam'].value==this.matchForm.controls['visitingTeam'].value)
    {
      this.toastr.warning('Home team and Visiting team cannot be same !')
      return;
    }

    this.match.matchTypes=this.matchTypeList.find(x=>x.Id==this.matchForm.controls['matchType'].value)?.name; 
    this.match.matchName=(this.matchForm.controls['matchName'].value)+' '+this.match.matchTypes; 
    this.match.matchTypeId=this.matchForm.controls['matchType'].value;
    this.match.location=this.matchForm.controls['location'].value; 
    this.match.teamHomeId=this.matchForm.controls['homeTeam'].value;
    this.match.teamHomeName=this.originalTeam.find(x=>x.teamId==this.matchForm.controls['homeTeam'].value)?.teamName
    this.match.teamVisitingId=this.matchForm.controls['visitingTeam'].value; 
    this.match.teamVisitingName=this.originalTeam.find(x=>x.teamId==this.matchForm.controls['visitingTeam'].value)?.teamName; 
    this.match.fromDate=this.matchForm.controls['startDate'].value; 
    this.match.toDate=this.matchForm.controls['startDate'].value; 
    this.match.seriesId=this.selectedSeries.seriesId;

    this.matches.saveMatch(this.match).subscribe(res=>{
      if(res)
      {
        this.router.navigate(['addmatchplayers',res]);
      }
    });
  }
  onValueChange(event:Date)
  {
     if(event!=null)
     {
      if(event.getDate()==this.minDate.getDate())
      {
        this.ismatchstart=true;
      }
      else{
        this.ismatchstart=false;
      }
    }
  }
}
