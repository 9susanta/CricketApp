import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { matchplayer } from 'src/app/_models/matchplayer';
import { matchplayerdetails } from 'src/app/_models/matchplayerdetails';
import { players } from 'src/app/_models/players';
import { MatchesService } from 'src/app/_services/matches.service';
import { MatchplayerService } from 'src/app/_services/matchplayer.service';

@Component({
  selector: 'app-add-match-players',
  templateUrl: './add-match-players.component.html',
  styleUrls: ['./add-match-players.component.css']
})
export class AddMatchPlayersComponent implements OnInit {

  personName:string='';
  persons:string[] = []
  teamHome:matchplayerdetails[]=[];
  teamVisiting:matchplayerdetails[]=[];
  selectedOver:number=4;
  tossWin:string='';
  tossDecide:string='';
  isdisabled:boolean=false;
  teamHomeName:string="Team A";
  teamVisitingName:string="Team B";
  selectedTeam:string=this.teamHomeName;
  matchId:number=0;
  match_player:matchplayer=
  {
      matchDetailsId:0, 
      matchId:this.matchId, 
      teamHomeId:0, 
      teamHomeName:this.teamHomeName, 
      teamVisitingId:0, 
      teamVisitingName:this.teamVisitingName, 
      totalOvers:this.selectedOver, 
      tossWinTeamId:0, 
      tossWinTeamName:this.tossWin, 
      tossDecideName:this.tossDecide, 
      tossBatting:'',  
      teamHomePlayers:'',
      teamVisitingPlayers:'',
      teamHomeBattingOrder:0,
      teamVisitingBattingOrder:0,
  };
  
  constructor(private router: Router,private activatedroutes: ActivatedRoute,
    private matchplayer:MatchplayerService,private match:MatchesService) {}
 
  @ViewChild(ModalDirective, { static: false }) modal?: ModalDirective;
  ngOnInit(): void {
    let id = this.activatedroutes.snapshot.paramMap.get("id");
    this.matchId=+id!;
    this.getteamsDetail(this.matchId);
  }
  showModal() {
    this.modal?.show();
  }
  getteamsDetail(matchId:number)
  {
    debugger;
    this.match.getmatchbyId(matchId).subscribe(result=>{
       console.log(result);
    },err=>{
      console.log(err);
    })
  }
  hideModal()
  {
    this.modal?.hide();
  }
  addPerson() {
    const name = this.personName.trim();
    if (name && !this.persons.includes(name)) {
      this.persons.push(name);
      if(this.selectedTeam==this.teamHomeName)
      {
        let player=new matchplayerdetails();
        player.playerId=0;
        player.name=name;
        this.teamHome.push(player);
      }
      else if(this.selectedTeam==this.teamVisitingName)
      {
        let player=new matchplayerdetails();
        player.playerId=0;
        player.name=name;
        this.teamVisiting.push(player);
      }
    }
    else{
      alert('This name already added !');
    }
    this.personName = "";
  }
  selectTeam(team:any)
  {
     this.selectedTeam=team;
  }
  setTotalOvers(value:any) {
    this.selectedOver = value;
  }
  toss(tosswin:any)
  {
    const lengthA = this.teamHome.length;
    const lengthB = this.teamVisiting.length;
    if (lengthA < 2 || lengthB < 2) {
      alert("Add minimum 2 players to both teams to continue");
    } 
    else {
     this.tossWin=tosswin;
     this.showModal();
    } 
  }
  tossDecider(decide:any)
  {
    this.tossDecide=decide;
  }
  confirm()
  {
    if(this.tossDecide=='')
    {
      alert('Choose a option first then click on confirm')
    }
    else{
      this.isdisabled=true;
      this.hideModal();
    }
  }
  startMatch()
  {
    debugger;
    this.match_player.matchId=this.matchId;
    this.match_player.totalOvers=this.selectedOver;
    this.match_player.tossWinTeamName=this.tossWin;
    this.match_player.tossDecideName=this.tossDecide;
    this.match_player.teamHomeBattingOrder=this.tossWin==this.teamHomeName?(this.tossDecide=="Batting"?1:2):(this.tossDecide!="Batting"?1:2);
    this.match_player.teamVisitingBattingOrder=this.tossWin==this.teamVisitingName?(this.tossDecide=="Batting"?1:2):(this.tossDecide!="Batting"?1:2);
    this.match_player.tossBatting=this.tossDecide=="Batting"?"1":"2";
    this.match_player.teamHomePlayers=JSON.stringify(this.teamHome);
    this.match_player.teamVisitingPlayers=JSON.stringify(this.teamVisiting);
    this.match_player.battingFirstTeamName=this.match_player.teamHomeBattingOrder==1?this.match_player.teamHomeName!:this.match_player.teamVisitingName!;
    this.match_player.battingSecondTeamName=this.match_player.teamVisitingBattingOrder==1?this.match_player.teamHomeName!:this.match_player.teamVisitingName!;

    this.matchplayer.startMatch(this.match_player).subscribe(response => {
      this.router.navigate(['scoreboard',this.matchId]);
    },err=>{
      debugger;
    });
  }
  allowDrop(ev:any) {
   // ev.preventDefault();
  }

  drag(ev:any) {
   // ev.dataTransfer.setData("text", ev.target.id);
  }

  drop(ev:any) {
   // ev.preventDefault();
    //var data = ev.dataTransfer.getData("text");
    //ev.target.appendChild(document.getElementById(data));
  }

}
