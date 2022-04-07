import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { players } from 'src/app/models/players';
import { series } from 'src/app/models/series';
import { team } from 'src/app/models/team';
import { PlayersService } from 'src/app/_services/players.service';
import { SeriesService } from 'src/app/_services/series.service';
import { TeamsServiceService } from 'src/app/_services/teams-service.service';

@Component({
  selector: 'app-squad',
  templateUrl: './squad.component.html',
  styleUrls: ['./squad.component.css']
})
export class SquadComponent implements OnInit {

  constructor(private fb: FormBuilder,private seriesService:SeriesService,private playerService:PlayersService,private teamsService:TeamsServiceService) { }
  squadForm!: FormGroup;
  serieses:series[]=[];
  seriesId!:number;
  teamid!:number;
  playerId!:number;
  players:players[]=[];
  teams:team[]=[];
  playerid!:number;
  isLocal:boolean=false;

  ngOnInit(): void {
    this.loadSeries();
    this.loadTeam();
    this.loadPlayer();
  }
  OnSubmit()
  {
    
  }
  loadSeries()
  {
    this.seriesService.getSeries(0,1000).subscribe(response => {
       this.serieses=response.result;
       this.serieses=this.serieses.filter(x=>x.statusName=="Schedule");
    });
  }
  loadPlayer()
  {
    this.playerService.getPlayers(0,10000).subscribe(response => {
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
  loadTeam()
  {
    this.teamsService.getTeams(0,1000).subscribe(response => {
       this.teams=response.result;
       this.teams=this.teams.filter(x=>x.teamTypeId==1);
    });
  }
  radioOnChange(event:any)
  {
    this.loadPlayer()
  }
}
