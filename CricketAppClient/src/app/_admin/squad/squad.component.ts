import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { players } from 'src/app/_models/players';
import { series } from 'src/app/_models/series';
import { team } from 'src/app/_models/team';
import { AppcommonService } from 'src/app/_services/appcommon.service';
import { PlayersService } from 'src/app/_services/players.service';
import { SeriesService } from 'src/app/_services/series.service';
import { TeamsServiceService } from 'src/app/_services/teams-service.service';

@Component({
  selector: 'app-squad',
  templateUrl: './squad.component.html',
  styleUrls: ['./squad.component.css']
})
export class SquadComponent implements OnInit {

  @ViewChild('palyersModal', { static: false }) modal?: ModalDirective;
  constructor(private fb: FormBuilder,private seriesService:SeriesService,private playerService:PlayersService,private teamsService:TeamsServiceService,private appcommonService:AppcommonService) { }
  squadForm!: FormGroup;
  serieses:series[]=[];
  seriesId!:number;
  teamid!:number;
  playerId!:number;
  players:players[]=[];
  teams:team[]=[];
  playerid!:number;
  isLocal:boolean=false;
  
  isDeleted:boolean=false;

  btnRemoveText='Remove Teams';

  ngOnInit(): void {
    this.loadSeries();
    this.loadTeam(0);
    this.loadPlayer();
  }
  OnSubmit()
  {
    
  }
  onShow()
  {
    this.modal?.show();
  }
  onClose()
  {
    this.modal?.hide();
  }
  getappcommonService(indx:number)
  {
    return this.appcommonService.generateRandom(indx);
  }
  loadSeries()
  {
    this.seriesService.getSeries(0,1000).subscribe(response => {
       this.serieses=response.result;
       this.serieses=this.serieses.filter(x=>x.statusName=="Schedule"||x.statusName=="Ongoing");
    });
  }
  loadPlayer()
  {
    this.playerService.getPlayers(0,2000).subscribe(response => {
       this.players=response.result;
       this.players=this.players.filter(x=>x.isDeleated==false);
       if(this.isLocal==false)
       {
        this.players=this.players.filter(x=>x.isLocalPlayer==false);
       }
       else if(this.isLocal==true)
       {
        this.players=this.players.filter(x=>x.isLocalPlayer==true);
       }
    });
  }
  loadTeam(filter:number)
  {
    let teamTypeId=0;
    if(filter==0)
    {
      teamTypeId=1;
    }
    else if(filter!=0)
    {
      teamTypeId=filter;
    }

    this.teamsService.getTeams(0,1000).subscribe(response => {
       this.teams=response.result;
       this.teams=this.teams.filter(x=>x.teamTypeId==teamTypeId);
    });
  }
  radioOnChange(event:any)
  {
    this.loadTeam(event.target.value)
  }
  onDeleteClick()
  {
    if(this.btnRemoveText=="Remove Teams")
    {
      this.isDeleted=true;
      this.btnRemoveText="Cancel";
    }
    else
    {
      this.isDeleted=false;
      this.btnRemoveText="Remove Teams";
    }
  }
  onTeamClick()
  {
    this.onShow();
  }
}
