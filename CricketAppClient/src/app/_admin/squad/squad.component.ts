import { Component, OnInit, ViewChild } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { players } from 'src/app/_models/players';
import { series } from 'src/app/_models/series';
import { team } from 'src/app/_models/team';
import { AppcommonService } from 'src/app/_services/appcommon.service';
import { ConfirmService } from 'src/app/_services/confirm.service';
import { PlayersService } from 'src/app/_services/players.service';
import { SeriesService } from 'src/app/_services/series.service';
import { SquadService } from 'src/app/_services/squad.service';
import { TeamsServiceService } from 'src/app/_services/teams-service.service';

@Component({
  selector: 'app-squad',
  templateUrl: './squad.component.html',
  styleUrls: ['./squad.component.css']
})
export class SquadComponent implements OnInit {

  @ViewChild('palyersModal', { static: false }) modal?: ModalDirective;
  constructor(private seriesService:SeriesService,
    private playerService:PlayersService,
    private teamsService:TeamsServiceService,
    private appcommonService:AppcommonService,private squadService:SquadService,
    private toastr:ToastrService,private confirmService:ConfirmService) { }
  serieses:series[]=[];
  seriesId!:number;
  teamid!:number;
  playerId!:number;
  players:players[]=[];
  originalTeam:team[]=[];
  originalTeamList:team[]=[];
  playerid!:number;
  isLocal:boolean=false;
  isDeleted:boolean=false;
  
  selectedSeries!:series

  selectedTeam!:team
   
  selectedTeamList:team[]=[];
  selectedPlayerList:players[]=[];

  btnRemoveText='Remove Teams';

  ngOnInit(): void {
    this.loadSeries();
    this.loadTeam(0);
    this.loadPlayer();
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
  getSquad(seriesId:number)
  {
    this.squadService.getSquad(seriesId).subscribe(result=>{
      this.selectedTeamList=[];
      for(let i=0;i<result.length;i++)
      {
        this.updateTeamList(JSON.parse(result[i].teams));
      }
    }) 
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
    if(this.originalTeamList.length<=0)
    {
      this.teamsService.getTeams(0,1000).subscribe(response => {
         this.originalTeamList=response.result;
         this.originalTeam=this.originalTeamList.map(obj => ({...obj})).filter(x=>x.teamTypeId==teamTypeId);
       });
    }
    else
    {
       this.originalTeam=this.originalTeamList.map(obj => ({...obj})).filter(x=>x.teamTypeId==teamTypeId);
    }
  }
  
  onChangeTeam(chkteam:team,event:any)
  {
    if(this.selectedSeries==null)
    {
      this.toastr.warning("Select a Tournament","Squad");
      event.target.checked=false;
      return;
    }
    if(event.target.checked)
    {
      chkteam.isAddedSeries=false;
      this.updateTeamList(chkteam)
    }
  }
  
  updateTeamList(selTeam:team)
  {
    this.selectedTeamList.push(selTeam);
    this.selectedTeamList=this.selectedTeamList.map(obj => ({...obj}));
    let orgIndex=this.originalTeam.findIndex(x=>x.teamId==selTeam.teamId);
    this.originalTeam[orgIndex].isAddedSeries=true;
  }
  onRemove(selteam:team)
  {
    this.confirmService.confirm('Confirm delete').subscribe(result => {
      if (result) 
      {   
        let indx=this.selectedTeamList.findIndex(x=>x.teamId==selteam.teamId)
        this.selectedTeamList.splice(indx,1);
        this.selectedTeamList=this.selectedTeamList.map(obj => ({...obj}));
        let orgIndex=this.originalTeam.findIndex(x=>x.teamId==selteam.teamId);
        this.originalTeam[orgIndex].isAddedSeries=false;
      }
      else
      {
        this.isDeleted=false;
        this.btnRemoveText="Remove Teams";
      }
    })
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
  onTeamClick(selectTeam:team)
  {
    this.selectedTeam=selectTeam;
    this.onShow();
  }
  
  onSeriesSelect(series:series)
  {
      this.selectedSeries=series;
      this.loadTeam(series.seriesTypeId!);
      this.getSquad(series.seriesId!);
  }
  onAddTeam()
  {
    if(this.selectedSeries==null)
    {
      this.toastr.warning("Select a Tournament","Squad");
      return;
    }
     let selectedTeam:any[]=[];
     for(let i=0;i<this.selectedTeamList.length;i++)
     {
      this.selectedTeamList[i].isAddedSeries=true;

       let obj:any={}
       obj.seriesId=this.selectedSeries.seriesId
       obj.teamId=this.selectedTeamList[i].teamId,
       obj.teamDetails=JSON.stringify(this.selectedTeamList[i])
       selectedTeam.push(obj);
     }
     this.squadService.addSquadTeam(selectedTeam).subscribe(res=>{
        this.selectedSeries={};
        if(res==1)
        {
          this.toastr.success("Teams for Tournament added successfully !","Squad")
        }
     })
  }
  onPlayerUpdate()
  {
    if(this.selectedTeam==null)
    {
      this.toastr.warning("Select a Team","Squad");
      return;
    }
     let obj:any={}
     obj.seriesId=this.selectedSeries.seriesId
     obj.teamId=this.selectedTeam.teamId,
     obj.playerSquadDetails=JSON.stringify(this.selectedPlayerList)
    
     this.squadService.addSquadPlayer(obj).subscribe(res=>{
      if(res==1)
      {
        this.toastr.success("Squad for Tournament added/Updated successfully !","Squad")
      }
     })
  }
  onPlayerSelect(players:players,event:any)
  {
    if(event.target.checked)
    {
     this.selectedPlayerList.push(players);
    }
    else
    {
      let indx=this.selectedPlayerList.findIndex(x=>x.playersId==players.playersId)
      this.selectedPlayerList.splice(indx,1);
    }
  }

  dropdownSettings:IDropdownSettings = {};
  dropdownList:team[] = [];
  selectedItems:team[] = [];
  loadFilters()
  {
    //this.dropdownList = this.originalTeam;
    //this.selectedItems = this.selectedTeam;
  }
  loadFilterControl()
  {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'teamId',
      textField: 'teamName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true
    };
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

}
