import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
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
  last_bowlerDetails:matchplayerdetails=new matchplayerdetails();

  battingTeamDetails:teamdetails=new teamdetails();
  bowlingTeamDetails:teamdetails=new teamdetails();

  battingTeam:string = "";
  bowlingTeam:string = "";

  striker:string="";
  nonStriker:string = "";
  bowler:string = "";

  extraRun:number[]=[0,1,2,3,4,5,6];
  extra_run:number=0;

  modalmessage:string="";
  modalName:string="";
  playersSet:matchplayerdetails[]=[];

  runmodalmessage:string="";
   
  target_run:number=0;
  over:number=0;

  selectedPlayerName:string="";

  matchStatus:string="countinue";

  @ViewChild('parentModal', { static: false }) modal?: ModalDirective;
  @ViewChild('runmademodal', { static: false }) runmademodal?: ModalDirective

  
  constructor(private route: ActivatedRoute,private matchplayer:MatchplayerService,private elRef:ElementRef) { }

   ngOnInit() {
    let id = this.route.snapshot.paramMap.get("id");
    this.matchplayer.getMatch(id).subscribe(async response => {
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
       await this.chooseStriker();
       await this.chooseNonStriker();
       await this.chooseBowler();
    });
  }
  async showModal(errmsg:string) {
    setTimeout(()=>{
      this.modal?.show();
    },300);
    return await this.getConfirmation('#confirm','input[name="options"]:checked',errmsg);
  }
  hideModal()
  {
    this.modal?.hide();
  }
  readPlayer(playerName:any)
  {
    this.selectedPlayerName=playerName;
  }
  async chooseStriker()
  {
    this.modalmessage="🏏 Choose Striker ?";
    this.modalName="striker";
    this.playersSet=[];
    let currentBattingTeam=this.currentBattingTeam.filter(x=>x.out==false&&x.name!=this.striker&&x.name!=this.nonStriker);
    if(currentBattingTeam.length>0)
    {
      this.playersSet=currentBattingTeam;
    }
    let playername= await this.showModal("Select a player !");

    if(playername!="")
    {
      this.striker=playername;
      let player= this.currentBattingTeam.find(item => item.name === playername);
      if(player)
      {
       player.isStriker = true;
       this.strikerDetails=player;
       this.hideModal();
      }
    }
  }
  async chooseNonStriker()
  {
    this.modalmessage="🏏 Choose Non-Striker ?";
    this.modalName="nonstriker";
    this.playersSet=[];
    let currentBattingTeam=this.currentBattingTeam.filter(x=>x.out==false&&x.name!=this.striker&&x.name!=this.nonStriker);
    if(currentBattingTeam.length>0)
    {
      this.playersSet=currentBattingTeam;
    }
    let playername=await this.showModal("Select a player !");
    
    if(playername!="")
    {
     
      this.nonStriker=playername;
      let player = this.currentBattingTeam.find(item => item.name === playername);
      if(player)
      { 
        this.hideModal();
        player.isNonStriker = true;
        this.nonStrikerDetails=player;
      }
    }
  }
  async chooseBowler()
  {
    this.modalmessage=" 🥎 Choose Bowler ?";
    this.modalName="bowler";
    this.playersSet=[];
    let currentBowlingTeam=this.currentBowlingTeam.filter(x=>x.name!=this.bowler);
    if(currentBowlingTeam.length>0)
    {
      this.playersSet=currentBowlingTeam;
    }
    let playername=await this.showModal("Select a player");
    if(playername!="")
    {
      this.bowler=playername;
      let player = this.currentBowlingTeam.find(item => item.name === playername);
      if(player)
      {
        player.isCurrentBowler = true;
        this.bowlerDetails=player;
        this.hideModal();
      }
     
    }
  }
  async eventClick(event:any)
  {
    event = isNaN(+event) ? event : +event; // Convert runs to numbers
    // In case we need to rotate strike
    if (event == "Ro") {
      this.rotatePlayer();
    }
     // In case of wicket
     else if (event == "W") {
      this.battingTeamDetails.wickets += 1;
      this.battingTeamDetails.overs += 1;

      // If it was run out, then get the runs made and update the scores
      let runs:number=+await this.extraRunModal("Runs made if Run-Out ?","Choose a option !");
  
      this.runmademodal?.hide(); 

      this.battingTeamDetails.total += runs;
      this.runScore(runs);
      this.ballBowled(event, runs);

      // Show additional runs made in history and add runs to bowler, if any
      if (runs) {
        //event = event+runs;
      }

      // If it is not one-man batting
      if (this.nonStrikerDetails.name!="") {
        this.modalmessage="Who got Out ?";
        this.modalName="wicket";
        this.playersSet=[];
        this.playersSet.push(this.strikerDetails,this.nonStrikerDetails)
        let wicket=await this.showModal("Select a player !");
        

        // If striker was out
        if (wicket == this.strikerDetails.name) {
          this.runScore("W", false); // Let him out
          this.chooseStriker(); 
          // If non-striker was out
        } else if (wicket == this.nonStrikerDetails.name) {
          this.runScore("W", false,true); // Let him out
          this.chooseNonStriker(); // Get new player to non-strike
        }

        // If it was one-man batting, then batting team is all out
      } else {
        this.runScore("W", false);
      }
    }
    // In case runs was scored
    else if (!["N", "Wd", "Re","Lb","B","P","Un"].includes(event)) {
      this.runScore(event);
      this.ballBowled(event);

      this.battingTeamDetails.total += event;
      this.battingTeamDetails.overs += 1;

      if (event % 2 == 1) {
        // If single or three, rotate strike
        this.rotatePlayer();
      }
    }
    else if (event != "Re") {
      // Additional runs made in that ball
      const runs=+await this.extraRunModal("Additional runs made ?","Choose a option !");
      this.runmademodal?.hide(); 
      
      // Add ball and runs to bowler
      this.ballBowled(event, runs);

      if (runs) {
        // Add runs to striker if N
        if (event == "N") {
          this.runScore(runs, false);
        }
        else if(["Lb","B"].includes(event))
        {
          // Add ball faced to striker
          this.runScore(0, true);
          this.battingTeamDetails.overs+=1;
        }
        // Rotate strike if odd run
        if (runs % 2 == 1) {
          this.rotatePlayer();
        }
      }
      this.battingTeamDetails.total += 1 + runs;
    }
    if (this.battingTeamDetails.overs > 0 &&
      this.battingTeamDetails.overs % 6 == 0) 
      {
        this.chooseBowler();
        
        this.rotatePlayer();

        this.last_bowlerDetails= this.bowlerDetails;
        this.bowlerDetails=new matchplayerdetails();
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
    }
    else if(["Lb", "B"].includes(event))
    {
      this.bowlerDetails.overs_bowl += 1;
      this.bowlerDetails.runs_given += extraRuns;
    }
    else if(event=="P"||event=="Un")
    {

    }
    else 
    {
      // Hit for runs
      this.bowlerDetails.overs_bowl += 1;
      this.bowlerDetails.runs_given += event;
    }
    this.bowlerDetails.overs_bowl_display=`${Math.floor( this.bowlerDetails.overs_bowl / 6)}.${
      this.bowlerDetails.overs_bowl % 6}`
    // Convert balls to overs
  }
  // Batting [countBall = false if Wd,W,N]
  runScore(event:any,countBall = true,isStrikeBatter=true)
  {
    if(isStrikeBatter==false)
    {
      if (event == "W") {
       // Wicket
       this.nonStrikerDetails.out = true;
      }
      return;
    }
    // Update faced ball only if specified
    if (countBall) {
        this.strikerDetails.balls_faced += 1;
    }

    if (event == "W") {
      // Wicket
      this.strikerDetails.out = true;
    } 
    else {
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
  async extraRunModal(message:string,errmsg:string)
  {
    this.runmodalmessage=message;
    this.runmademodal?.show();
    return await this.getConfirmation('#rumconfirm','input[name="optionsrun"]:checked',errmsg);
  }
  onRunConfirm()
  {
    this.runmademodal?.hide();    
  }
  async getConfirmation(targetBtnId:string,checkBoxsId:string,errmsg:string):Promise<string> {
    const checkedRadio = this.elRef.nativeElement.querySelector(checkBoxsId) as HTMLInputElement;
    if(checkedRadio)
    {
      checkedRadio.checked=false;
    }
    return new Promise<string>((resolve, reject) => {
      let confirm=this.elRef.nativeElement.querySelector(targetBtnId)
      let temp = confirm.cloneNode(true);
      confirm.parentNode.replaceChild(temp, confirm);
      confirm = temp;
      temp=undefined;

      confirm.addEventListener('click',() => {
        const selectedItem = this.elRef.nativeElement.querySelector(checkBoxsId) as HTMLInputElement;
        console.log(selectedItem);
        if (selectedItem) {
          resolve((selectedItem.value)); // Return selected player
        }
        else{
          alert(errmsg);
        }
    },false);
    });
  }
}
