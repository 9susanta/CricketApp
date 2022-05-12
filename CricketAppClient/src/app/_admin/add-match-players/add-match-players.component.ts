import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { matchplayer } from 'src/app/_models/matchplayer';
import { matchplayerdetails } from 'src/app/_models/matchplayerdetails';
import { players } from 'src/app/_models/players';
import { MatchplayerService } from 'src/app/_services/matchplayer.service';

@Component({
  selector: 'app-add-match-players',
  templateUrl: './add-match-players.component.html',
  styleUrls: ['./add-match-players.component.css']
})
export class AddMatchPlayersComponent implements OnInit {

  personName:string='';
  persons:string[] = []
  teamA:matchplayerdetails[]=[];
  teamB:matchplayerdetails[]=[];
  selectedOver:number=4;
  tossWin:string='';
  tossDecide:string='';
  isdisabled:boolean=false;
  teamAName:string="Team A";
  teamBName:string="Team B";
  selectedTeam:string=this.teamAName;
  matchId:number=0;
  match_player:matchplayer=
  {
      matchDetailsId:0, 
      matchId:this.matchId, 
      teamAId:0, 
      teamAName:this.teamAName, 
      teamBId:0, 
      teamBName:this.teamBName, 
      totalOvers:this.selectedOver, 
      tossWinTeamId:0, 
      tossWinTeamName:this.tossWin, 
      tossDecideName:this.tossDecide, 
      tossBatting:'',  
      teamAPlayers:'',
      teamBPlayers:'',
      teamABattingOrder:0,
      teamBBattingOrder:0,
  };
  
  constructor(private router: Router,private activatedroutes: ActivatedRoute,private matchplayer:MatchplayerService) {}
 
  @ViewChild(ModalDirective, { static: false }) modal?: ModalDirective;
  ngOnInit(): void {
    let id = this.activatedroutes.snapshot.paramMap.get("id");
    this.matchId=+id!;
  }
  showModal() {
    this.modal?.show();
  }
  hideModal()
  {
    this.modal?.hide();
  }
  addPerson() {
    const name = this.personName.trim();
    if (name && !this.persons.includes(name)) {
      this.persons.push(name);
      if(this.selectedTeam==this.teamAName)
      {
        let player=new matchplayerdetails();
        player.playerId=0;
        player.name=name;
        this.teamA.push(player);
      }
      else if(this.selectedTeam==this.teamBName)
      {
        let player=new matchplayerdetails();
        player.playerId=0;
        player.name=name;
        this.teamB.push(player);
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
    const lengthA = this.teamA.length;
    const lengthB = this.teamB.length;
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
  funconfirm()
  {
    if(this.tossDecide=='')
    {
      alert('Choose a option frist then click on confirm')
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
    this.match_player.teamABattingOrder=this.tossWin==this.teamAName?(this.tossDecide=="Batting"?1:2):(this.tossDecide!="Batting"?1:2);
    this.match_player.teamBBattingOrder=this.tossWin==this.teamBName?(this.tossDecide=="Batting"?1:2):(this.tossDecide!="Batting"?1:2);
    this.match_player.tossBatting=this.tossDecide=="Batting"?"1":"2";
    this.match_player.teamAPlayers=JSON.stringify(this.teamA);
    this.match_player.teamBPlayers=JSON.stringify(this.teamB);
    this.match_player.battingFirstTeamName=this.match_player.teamABattingOrder==1?this.match_player.teamAName!:this.match_player.teamBName!;
    this.match_player.battingSecondTeamName=this.match_player.teamBBattingOrder==1?this.match_player.teamAName!:this.match_player.teamBName!;

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
