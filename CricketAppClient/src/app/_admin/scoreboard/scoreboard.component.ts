import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { matchplayer } from 'src/app/models/matchplayer';
import { matchplayerdetails } from 'src/app/models/matchplayerdetails';
import { teamdetails } from 'src/app/models/teamdetails';
import { MatchplayerService } from 'src/app/_services/matchplayer.service';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.css']
})
export class ScoreboardComponent implements OnInit {

  id:number=0;
  match_player:matchplayer={};
  teamAPlayers:matchplayerdetails[]=[];
  teamBPlayers:matchplayerdetails[]=[];

  currentBattingTeam:matchplayerdetails[]=[];
  currentBowlingTeam:matchplayerdetails[]=[];

  strikerDetails:matchplayerdetails=new matchplayerdetails();
  nonStrikerDetails:matchplayerdetails=new matchplayerdetails();
  bowlerDetails:matchplayerdetails=new matchplayerdetails();

  battingTeamDetails:teamdetails=new teamdetails();
  bowlingTeamDetails:teamdetails=new teamdetails();

  battingTeam:string = "";
  bowlingTeam:string = "";

   striker:string="";
   nonStriker:string = "";
   bowler:string = "";

  modalmessage:string="";
  modalName:string="";
  playersSet:matchplayerdetails[]=[];

  selectedPlayerName:string="";

  matchStatus:string="countinue";

  @ViewChild(ModalDirective, { static: false }) modal?: ModalDirective;
  constructor(private route: ActivatedRoute,private matchplayer:MatchplayerService) { }
  
  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get("id");
    this.matchplayer.getMatch(id).subscribe(response => {
      this.match_player=response;
      let playerTeamA:string=this.match_player.teamAPlayers!;
      this.teamAPlayers=JSON.parse(playerTeamA)
      let playerTeamB=this.match_player.teamBPlayers!;
      this.teamBPlayers=JSON.parse(playerTeamB);
      this.battingTeam=this.match_player.teamABattingNoAtToss==1?'A':'B';
      this.bowlingTeam=this.match_player.teamBBattingNoAtToss==1?'A':'B';
      if(this.battingTeam=="A")
      {
        for(let i=0;this.teamAPlayers.length>i;i++)
        {
          let player:matchplayerdetails=new matchplayerdetails();
          player.playerId=this.teamAPlayers[i].playerId;
          player.name=this.teamAPlayers[i].name;
          this.currentBattingTeam.push(player);
        } 
        
      }
      else if(this.battingTeam=="B")
      {
        for(let i=0;this.teamBPlayers.length>i;i++)
        {
           let player:matchplayerdetails=new matchplayerdetails();
           player.playerId=this.teamBPlayers[i].playerId;
           player.name=this.teamBPlayers[i].name;
           this.currentBattingTeam.push(player);
        } 
      }
      if(this.bowlingTeam=="A")
      {
        for(let i=0;this.teamAPlayers.length>i;i++)
        {

          let player:matchplayerdetails=new matchplayerdetails();
          player.playerId=this.teamAPlayers[i].playerId;
          player.name=this.teamAPlayers[i].name;
           this.currentBowlingTeam.push(player);
        } 
      }
      else if(this.bowlingTeam=="B")
      {
        for(let i=0;this.teamBPlayers.length>i;i++)
        {
          let player:matchplayerdetails=new matchplayerdetails();
          player.playerId=this.teamBPlayers[i].playerId;
          player.name=this.teamBPlayers[i].name;
          this.currentBowlingTeam.push(player);
        } 
      }
      this.chooseStriker();
    }); 
  }
  showModal() {
    this.modal?.show();
  }
  hideModal()
  {
    this.modal?.hide();
  }
  readPlayer(playerName:any)
  {
    this.selectedPlayerName=playerName;
  }
  chooseStriker()
  {
    this.modalmessage="🏏 Choose Striker ?";
    this.modalName="striker";
    this.playersSet=[];
    let currentBattingTeam=this.currentBattingTeam.filter(x=>x.out==false&&x.name!=this.striker&&x.name!=this.nonStriker);
    if(currentBattingTeam.length>0)
    {
      this.playersSet=currentBattingTeam;
    }
    this.showModal();
  }
  chooseNonStriker()
  {
    this.modalmessage="🏏 Choose Non-Striker ?";
    this.modalName="nonstriker";
    this.playersSet=[];
    let currentBattingTeam=this.currentBattingTeam.filter(x=>x.out==false&&x.name!=this.striker&&x.name!=this.nonStriker);
    if(currentBattingTeam.length>0)
    {
      this.playersSet=currentBattingTeam;
    }
    this.showModal();
  }
  chooseBowler()
  {
    this.modalmessage=" 🥎 Choose Bowler ?";
    this.modalName="bowler";
    this.playersSet=[];
    let currentBowlingTeam=this.currentBowlingTeam.filter(x=>x.name!=this.bowler);
    if(currentBowlingTeam.length>0)
    {
      this.playersSet=currentBowlingTeam;
    }
    this.showModal();
  }
  onConfirm(modalName:string)
  {
      if(modalName=="striker")
      {
        if(this.selectedPlayerName!="")
        {
          this.hideModal();
          this.striker=this.selectedPlayerName;
          let player= this.currentBattingTeam.find(item => item.name === this.selectedPlayerName);
          if(player)
          {
            player.isStriker = true;
            this.strikerDetails=player;
          } 
          this.chooseNonStriker();
        }
        else{
          alert("Choose striker !")
        }
      }
      else if(modalName=="nonstriker")
      {
        if(this.selectedPlayerName!="")
        {
          this.hideModal();
          this.nonStriker=this.selectedPlayerName;
          let player = this.currentBattingTeam.find(item => item.name === this.selectedPlayerName);
          if(player)
          {
            player.isNonStriker = true;
            this.nonStrikerDetails=player;
          }
          this.chooseBowler();
        }
        else{
          alert("Choose non-striker !")
        }
      }
      else if(modalName=="bowler")
      {
        if(this.selectedPlayerName!="")
        {
          this.bowler=this.selectedPlayerName;
          let player = this.currentBowlingTeam.find(item => item.name === this.selectedPlayerName);
          if(player)
          {
            player.isCurrentBowler = true;
            this.bowlerDetails=player;
          }
          this.hideModal();
        }
        else{
          alert("Choose a bowler !")
        }
      }
  }
  eventClick(event:any)
  {
    event = isNaN(+event) ? event : +event; // Convert runs to numbers
    // In case we need to rotate strike
    if (event == "Ro") {
      this.rotatePlayer();
    }
    // In case runs was scored
    else if (!["N", "Wd", "Re"].includes(event)) {
      this.runScore(event);
      this.ballBowled(event);

      this.battingTeamDetails.total += event;
      this.battingTeamDetails.overs += 1;

      if (event % 2 == 1) {
        // If single or three, rotate strike
        this.rotatePlayer();
      }
    }
    if (this.battingTeamDetails.overs > 0 &&
      this.battingTeamDetails.overs % 6 == 0) 
      {
      this.chooseBowler();
      this.rotatePlayer();
    }
  }
  // Bowling [extraRuns in case of Wd,N,W]
  ballBowled(event:any, extraRuns = 0) {
    if (["Wd", "N"].includes(event)) {
      // Extras
      this.bowlerDetails.runs_given += 1 + extraRuns;
    } else if (event == "W") {
      //Wicket
      this.bowlerDetails.overs_bowl += 1;
      this.bowlerDetails.wickets_taken += 1;
      this.bowlerDetails.runs_given += extraRuns;
    } else {
      // Hit for runs
      this.bowlerDetails.overs_bowl += 1;
      this.bowlerDetails.runs_given += event;
    }
    this.bowlerDetails.overs_bowl_display=`${Math.floor( this.bowlerDetails.overs_bowl / 6)}.${
      this.bowlerDetails.overs_bowl % 6}`
    // Convert balls to overs
  }
  // Batting [countBall = false if Wd,W,N]
  runScore(event:any,countBall = true)
  {
    // Update faced ball only if specified
    if (countBall) {
      this.strikerDetails.balls_faced += 1;
    }

    if (event == "W") {
      // Wicket
      this.strikerDetails.out = true;
    } else {
      // Score runs
      this.strikerDetails.runs_score += event;

      if (event == 4) {
        // Boundary count
        this.strikerDetails.fours += 1;
      } else if (event == 6) {
        this.strikerDetails.sixes += 1;
      }
    }
  }
  rotatePlayer()
  {
    [this.strikerDetails, this.nonStrikerDetails] = [this.nonStrikerDetails, this.strikerDetails];
  }
}
