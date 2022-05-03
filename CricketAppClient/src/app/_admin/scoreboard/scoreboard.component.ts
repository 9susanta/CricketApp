import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  //Start-Match Data
  _match_id:number=0;
  match_player:matchplayer={};
  
  teamAPlayers:matchplayerdetails[]=[];
  teamBPlayers:matchplayerdetails[]=[];

  target_run:number=0;
  totover:number=0;
  outcome:any=[null,null,null];

  currentmatchDetails:any;

  matchStatus:number=0;
  bufferMatchStatus:number=0;
  //0-Start of Match||1-Start 1st Innings||2-Innings Break||3-Start 2nd Innings||4-Result||5-Break 
  //End-Match Data

  battingTeamDetails:teamdetails=new teamdetails();
  bowlingTeamDetails:teamdetails=new teamdetails();
  
  lastballScore:number=0;
  lastballEvent:string="";
  
  lastEvents:string[]=[];
    
  //End-Match Details Data
  
  //Start-Modal Data
  extraRun:number[]=[0,1,2,3,4,5,6];
  modalmessage:string="";
  modalName:string="";
  playersSet:matchplayerdetails[]=[];

  runmodalmessage:string="";

  resultModalmessage:string="";

  @ViewChild('parentModal', { static: false }) modal?: ModalDirective;
  @ViewChild('runmademodal', { static: false }) runmademodal?: ModalDirective;
  @ViewChild('breakModal', { static: false }) breakModal?: ModalDirective;
  @ViewChild('resultModal', { static: false }) resultModal?: ModalDirective;
  //End-Modal Data

  constructor(private route: ActivatedRoute,private router:Router,private matchplayer:MatchplayerService,private elRef:ElementRef) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get("id");
    this.matchplayer.getMatch(id).subscribe(async response => {
      this.match_player=response;
      this._match_id=this.match_player.matchId!;
      let playerTeamA:string=this.match_player.teamAPlayers!;
      this.teamAPlayers=JSON.parse(playerTeamA)
      let playerTeamB=this.match_player.teamBPlayers!;
      this.teamBPlayers=JSON.parse(playerTeamB);
      this.totover=this.match_player.totalOvers!;

      this.matchplayer.createHubConnection(this._match_id);

      //Need to change after frist innings
      if(this.match_player.currentmatchDetails!=null)
      {
         this.currentmatchDetails=JSON.parse(this.match_player.currentmatchDetails!);
         this.matchStatus=this.currentmatchDetails.matchStatus;
         if([2,5].includes(this.matchStatus))
         {
           if(this.matchStatus==2)
           {
            this.battingTeamDetails=this.currentmatchDetails.battingTeamDetails;
            this.bowlingTeamDetails=this.currentmatchDetails.bowlingTeamDetails;
           }
           this.showBreakModal();
         }
         if(this.matchStatus!=2)
         {
            this.battingTeamDetails=this.currentmatchDetails.battingTeamDetails;
            this.bowlingTeamDetails=this.currentmatchDetails.bowlingTeamDetails;
            this.lastballScore=this.currentmatchDetails.lastballScore;
            this.lastballEvent=this.currentmatchDetails.lastballEvent;
            this.lastEvents=this.currentmatchDetails.lastEvents;
            this.outcome=this.currentmatchDetails.outcome;
         }
         if(this.matchStatus==4)
         {
           this.displayResult();
         }
      }
      else
      {
          this.matchStatus=1;
          this.battingTeamDetails.totOver=this.match_player.totalOvers!
          this.battingTeamDetails.name=this.match_player.battingFirstTeamName!;
          this.bowlingTeamDetails.name=this.match_player.battingSecondTeamName!;

          this.battingTeamDetails.battingOrder=1;
          this.bowlingTeamDetails.battingOrder=2;

          if(this.battingTeamDetails.name==this.match_player.teamAName!)
          {
            this.battingTeamDetails.players=this.teamAPlayers; 
          }
          else if(this.battingTeamDetails.name==this.match_player.teamBName!)
          {
            this.battingTeamDetails.players=this.teamBPlayers;
          }
          if(this.bowlingTeamDetails.name==this.match_player.teamAName!)
          {
            this.bowlingTeamDetails.players=this.teamAPlayers;
          }
          else if(this.bowlingTeamDetails.name==this.match_player.teamBName!)
          {
            this.bowlingTeamDetails.players=this.teamBPlayers;
          }
      }
      if(this.battingTeamDetails.strikerDetails.name=="")
      {
          await this.chooseStriker();
      }
      if(this.battingTeamDetails.nonStrikerDetails.name=="")
      {
          await this.chooseNonStriker();
      }
      if(this.bowlingTeamDetails.bowlerDetails.name=="")
      {
          await this.chooseBowler();
      }
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
  async showBreakModal()
  {
    setTimeout(()=>{
      this.breakModal?.show();
    },300);
  }
  hidebreakModal()
  {
    this.breakModal?.hide();
  }
  async chooseStriker()
  {
    let currentBattingTeam=this.battingTeamDetails.players.filter(x=>x.out==false&&x.name!=this.battingTeamDetails.strikerDetails.name&&x.name!=this.battingTeamDetails.nonStrikerDetails.name);
    if(currentBattingTeam.length>1)
    {
      this.modalmessage="🏏 Choose Striker ?";
      this.modalName="striker";
      this.playersSet=[];
      this.playersSet=currentBattingTeam;
      let playername= await this.showModal("Select a player !");
       if(playername!="")
       {
         let player= this.battingTeamDetails.players.find(item => item.name === playername);
         if(player)
         {
           player.isStriker = true;
           this.battingTeamDetails.strikerDetails=player;
           if(this.battingTeamDetails.wickets==0)
           {
             this.battingTeamDetails.strikerDetails.battingNo=1;
           }
           else
           {
            this.battingTeamDetails.strikerDetails.battingNo=(this.battingTeamDetails.wickets+2);
           }
           this.hideModal();
         }
       }
    }
    else if(currentBattingTeam.length>0)
    {
      let stikerchose=currentBattingTeam[0];
      let player= this.battingTeamDetails.players.find(item => item.name === stikerchose.name);
      if(player)
      {
        player.isStriker = true;
        this.battingTeamDetails.strikerDetails=player;
        if(this.battingTeamDetails.wickets==0)
           {
             this.battingTeamDetails.strikerDetails.battingNo=1;
           }
           else
           {
            this.battingTeamDetails.strikerDetails.battingNo=(this.battingTeamDetails.wickets+2);
           }
      }
    }
    this.onStrikerDetailsUpdate();
    this.updateScore();
  }
  async chooseNonStriker()
  {
    let currentBattingTeam=this.battingTeamDetails.players.filter(x=>x.out==false&&x.name!=this.battingTeamDetails.strikerDetails.name&&x.name!=this.battingTeamDetails.nonStrikerDetails.name);
    if(currentBattingTeam.length>1)
    {
      this.modalmessage="🏏 Choose Non-Striker ?";
      this.modalName="nonstriker";
       this.playersSet=[];
       this.playersSet=currentBattingTeam;
      
       let playername=await this.showModal("Select a player !");
    
       if(playername!="")
       {
        let player = this.battingTeamDetails.players.find(item => item.name === playername);
        if(player)
        { 
          this.hideModal();
          player.isNonStriker = true;
          this.battingTeamDetails.nonStrikerDetails=player;
          if(this.battingTeamDetails.wickets==0)
          {
            this.battingTeamDetails.nonStrikerDetails.battingNo=1;
          }
          else
          {
            this.battingTeamDetails.nonStrikerDetails.battingNo=(this.battingTeamDetails.wickets+2);
          }
        }
       }
    }
    else if(currentBattingTeam.length>0)
    {
      let nonStikerchoose=currentBattingTeam[0];
      let player = this.battingTeamDetails.players.find(item => item.name === nonStikerchoose.name);
      if(player)
      { 
        player.isNonStriker = true;
        this.battingTeamDetails.nonStrikerDetails=player;
        if(this.battingTeamDetails.wickets==0)
          {
            this.battingTeamDetails.nonStrikerDetails.battingNo=2;
          }
          else
          {
            this.battingTeamDetails.nonStrikerDetails.battingNo=(this.battingTeamDetails.wickets+2);
          }
      }
    }
    this.onNonStrikerDetailsUpdate();
    this.updateScore();
  }
  async chooseBowler()
  {
    this.modalmessage=" 🥎 Choose Bowler ?";
    this.modalName="bowler";
    this.playersSet=[];
    let currentBowlingTeam=this.bowlingTeamDetails.players.filter(x=>x.name!=this.bowlingTeamDetails.bowlerDetails.name);
    
    if(currentBowlingTeam.length>1)
    {
      this.playersSet=currentBowlingTeam;
      let playername=await this.showModal("Select a player");
      if(playername!="")
      {
        let player = this.bowlingTeamDetails.players.find(item => item.name === playername);
        if(player)
        {
           player.isCurrentBowler = true;
           this.bowlingTeamDetails.bowlerDetails=player;
           this.hideModal();
        }
      }
     }
     else if(currentBowlingTeam.length>0)
     {
        let bolwerchoose=currentBowlingTeam[0];
        let player = this.bowlingTeamDetails.players.find(item => item.name === bolwerchoose.name);
        if(player)
        {
            player.isCurrentBowler = true;
            this.bowlingTeamDetails.bowlerDetails=player;
        }
     }
     if(this.bowlingTeamDetails.bowlerDetails.bowlingNo==0)
     {
      this.bowlingTeamDetails.bowlerDetails.bowlingNo=(this.bowlingTeamDetails.last_bowlerDetails.bowlingNo+1)
     }
     else
     {
      this.bowlingTeamDetails.bowlerDetails.bowlingNo=(this.bowlingTeamDetails.bowlerDetails.bowlingNo+1)
     }
     this.onBowlerDetailsUpdate();
     this.updateScore();
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
      if (runs>=0) {
        let msg:any;
        if(runs)
        {
         msg=event;
        }
        else{
          msg=`${event}+${runs}`
        }
        this.updateLastEvents(msg);
      }

      // If it is not one-man batting
      if (this.battingTeamDetails.nonStrikerDetails.name!="") {
        this.modalmessage="Who got Out ?";
        this.modalName="wicket";
        this.playersSet=[];
        this.playersSet.push(this.battingTeamDetails.strikerDetails,this.battingTeamDetails.nonStrikerDetails)
        let wicket=await this.showModal("Select a player !");
        this.hideModal();
        
        // If striker was out
        if (wicket == this.battingTeamDetails.strikerDetails.name) {
          this.runScore("W", false); // Let him out
          if((this.battingTeamDetails.players.length - this.battingTeamDetails.wickets)>1)
          {
            this.chooseStriker(); 
          }
          // If non-striker was out
        } else if (wicket == this.battingTeamDetails.nonStrikerDetails.name) {
          this.runScore("W", false,false); // Let him out
          if((this.battingTeamDetails.players.length - this.battingTeamDetails.wickets)>1)
          {
             this.chooseNonStriker();
          } 
          // Get new player to non-strike
        }
        let objfow:any={};
        objfow.batter=wicket;
        objfow.overs=`${Math.floor(this.battingTeamDetails.overs / 6)}.${this.battingTeamDetails.overs % 6}`;
        objfow.totRun=this.battingTeamDetails.total;
        this.battingTeamDetails.fallOfWickets.push(objfow);

        // If it was one-man batting, then batting team is all out
      } else {
        this.runScore("W", false);
      }
    }
    // In case runs was scored
    else if (!["N", "Wd", "Re","Lb","B","P","Un","Bc","W","Ro"].includes(event)) {
      this.runScore(event);
      this.ballBowled(event);

      this.battingTeamDetails.total += event;
      this.battingTeamDetails.overs += 1;

      if (event % 2 == 1) {
        // If single or three, rotate strike
        this.rotatePlayer();
      }
      this.lastballScore=+event;
      this.updateLastEvents(`${event}`);
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
          this.runScore(runs, true);
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
     if(event=="N")
     { 
        this.battingTeamDetails.nb += 1 + runs;
     }
     else if(event=="W")
     {
      this.battingTeamDetails.wide += 1 + runs;
     }
     else if(event=="Lb")
     {
      this.battingTeamDetails.lb += runs;
     }
     else if(event=="B")
     {
      this.battingTeamDetails.b+=runs;
     }
     this.battingTeamDetails.extra=(this.battingTeamDetails.nb+
     this.battingTeamDetails.wide+this.battingTeamDetails.lb+this.battingTeamDetails.b);

      this.battingTeamDetails.total += 1 + runs;
      this.lastballScore=runs;
      this.updateLastEvents(`${event}+${runs}`);
    }
    this.lastballEvent=event;
    
    this.battingTeamDetails.overInTxt=`${Math.floor(this.battingTeamDetails.overs / 6)}.${this.battingTeamDetails.overs % 6}`
    this.battingTeamDetails.runRate= (this.battingTeamDetails.total/((this.battingTeamDetails.overs==0?1:this.battingTeamDetails.overs)*0.1666666)).toFixed(2);
    
    this.onprocessingOutcome(event);
    
     this.updateScore();
     this.onmatchStatus();
  }
  async eventBowlerChangeClick()
  {
    this.bowlerDetailsSwap();
    await this.chooseBowler();
  }
  // Bowling [extraRuns in case of Wd,N,W]
  ballBowled(event:any, extraRuns = 0) {
    if (["Wd", "N"].includes(event)) {
      // Extras
      this.bowlingTeamDetails.bowlerDetails.runs_given += 1 + extraRuns;
    } else if (event == "W") {
      //Wicket
      this.bowlingTeamDetails.bowlerDetails.overs_bowl += 1;
      this.bowlingTeamDetails.bowlerDetails.wickets_taken += 1;
      this.bowlingTeamDetails.bowlerDetails.runs_given += extraRuns;
    }
    else if(["Lb", "B"].includes(event))
    {
      this.bowlingTeamDetails.bowlerDetails.overs_bowl += 1;
      this.bowlingTeamDetails.bowlerDetails.runs_given += extraRuns;
    }
    else if(event=="P"||event=="Un")
    {
    }
    else 
    {
      // Hit for runs
      this.bowlingTeamDetails.bowlerDetails.overs_bowl += 1;
      this.bowlingTeamDetails.bowlerDetails.runs_given += event;
    }
     this.bowlingTeamDetails.bowlerDetails.economy=(this.bowlingTeamDetails.bowlerDetails.runs_given/(this.bowlingTeamDetails.bowlerDetails.overs_bowl*0.1666666)).toFixed(2);
     this.bowlingTeamDetails.bowlerDetails.overs_bowl_display=`${Math.floor(this.bowlingTeamDetails.bowlerDetails.overs_bowl / 6)}.${this.bowlingTeamDetails.bowlerDetails.overs_bowl % 6}`
     
     this.onBowlerDetailsUpdate();
  }
  // Batting [countBall = false if Wd,W,N]
  runScore(event:any,countBall = true,isStrikeBatter=true)
  {
    if(isStrikeBatter==false)
    {
      if (event == "W") {
       // Wicket
       this.battingTeamDetails.nonStrikerDetails.out = true;
       this.battingTeamDetails.nonStrikerDetails.isNonStriker=false;
      }
    }
    else 
    {
      if (countBall) {
          this.battingTeamDetails.strikerDetails.balls_faced += 1;
      }
      if (event == "W") {
        // Wicket
         this.battingTeamDetails.strikerDetails.out = true;
         this.battingTeamDetails.strikerDetails.isStriker=false;
      } 
      else 
      {
        // Score runs
        this.battingTeamDetails.strikerDetails.runs_score += event;
        if (event == 4) {
          // Boundary count
          this.battingTeamDetails.strikerDetails.fours += 1;
        } else if (event == 6) {
          this.battingTeamDetails.strikerDetails.sixes += 1;
        }
      }
    }       
    this.battingTeamDetails.strikerDetails.strike_rate=((this.battingTeamDetails.strikerDetails.runs_score/this.battingTeamDetails.strikerDetails.balls_faced)*100).toFixed(2);
    
    this.onStrikerDetailsUpdate();
    this.onNonStrikerDetailsUpdate();
  }
  rotatePlayer()
  {
    [this.battingTeamDetails.strikerDetails, this.battingTeamDetails.nonStrikerDetails] = [this.battingTeamDetails.nonStrikerDetails, this.battingTeamDetails.strikerDetails];
  }
  async extraRunModal(message:string,errmsg:string)
  {
    this.runmodalmessage=message;
    this.runmademodal?.show();
    return await this.getConfirmation('#rumconfirm','input[name="optionsrun"]:checked',errmsg);
  }
  displayResult()
  {
     if(this.outcome[2]=="Draw")
     {
        this.resultModalmessage="The match is draw";
     }
     else if(this.outcome[2]=="Runs")
     {
       this.resultModalmessage=`${this.bowlingTeamDetails.name}`+' Won by '+`${this.outcome[1]}`+' Run';
     }  
     else if(this.outcome[2]=="Wickets")
     {
        this.resultModalmessage=`${this.battingTeamDetails.name}`+' Won by '+`${this.outcome[1]}`+' Wickets';
     }    
     this.resultModal?.show();
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
        if (selectedItem) {
          resolve((selectedItem.value)); // Return selected player
        }
        else{
          alert(errmsg);
        }
    },false);
    });
  }
  updateScore()
  {
    let updateObj:any={};
    updateObj.battingTeamDetails=this.battingTeamDetails;
    updateObj.bowlingTeamDetails=this.bowlingTeamDetails;
    updateObj.lastballScore=this.lastballScore;
    updateObj.lastballEvent=this.lastballEvent;
    updateObj.matchStatus=this.matchStatus;
    updateObj.lastEvents=this.lastEvents;
    updateObj.outcome=this.outcome;

    let obj={matchId:this._match_id,currentmatchDetails:JSON.stringify(updateObj)};

    // this.matchplayer.updateMatchScore(obj).subscribe(response => {
    //   console.log(response);
    // });
      this.matchplayer.sendLivescore(obj).then(() => {}).finally(() => {}).catch(obj=>{
        console.log(obj);
      });
  }
  breakClick()
  {
    this.showBreakModal();
  }
  async breakEventConfirm()
  {
    if(this.bufferMatchStatus!=0)
    {
      this.matchStatus=this.bufferMatchStatus;
      if(this.matchStatus==3)
      {    
           this.newInningsStart();
           this.hidebreakModal();
           await this.chooseStriker();
           await this.chooseNonStriker();
           await this.chooseBowler();
      }
      else
      {
         this.hidebreakModal();
      }
    }
    else{
      alert("select a option !")
    }
    this.bufferMatchStatus=0;
  }
  breakEventClick(event:any)
  {
    if(this.battingTeamDetails.battingOrder==1&&event==6)
    {
      this.bufferMatchStatus=1;
    }
    else if(this.battingTeamDetails.battingOrder==2&&event==6)
    {
      this.bufferMatchStatus=3;
    }
    else
    {
      this.bufferMatchStatus=event;
    }
  }
  newInningsStart()
  {
    [this.battingTeamDetails,this.bowlingTeamDetails]=[this.bowlingTeamDetails,this.battingTeamDetails];
  }
  updateLastEvents(event:string)
  {
    if(this.lastEvents.length=13)
    {
      this.lastEvents=this.lastEvents.slice(1)
    }
    this.lastEvents.push(event);
  }
  onClickNewMatch()
  {
    this.router.navigate(['match']);
  }
  onmatchStatus()
  {
    if(this.outcome[2]!=null)
     {
        if(this.matchStatus==4)
        {
          this.displayResult();
        }
        else  if(this.matchStatus==2)
        {
          this.showBreakModal();
        }
     }
  }
  onprocessingOutcome(event:string)
  {
    if (this.battingTeamDetails.overs > 0 &&(this.battingTeamDetails.overs % 6 == 0)) 
      {
        if(this.battingTeamDetails.overs==(this.totover*6)||
        (this.battingTeamDetails.players.length - this.battingTeamDetails.wickets)==1||
        (this.battingTeamDetails.total > this.bowlingTeamDetails.total &&this.battingTeamDetails.battingOrder == 2)||
        (this.battingTeamDetails.total == this.bowlingTeamDetails.total))
        {
          if((this.battingTeamDetails.players.length - this.battingTeamDetails.wickets)==1)
          {
             if(this.battingTeamDetails.battingOrder == 1)
             {
               this.outcome = [null, null, "InningsBreak"];
               this.matchStatus=2;
             }
             else if(this.battingTeamDetails.battingOrder == 2)
             {
               if (this.battingTeamDetails.total == this.bowlingTeamDetails.total) 
               {
                 // Draw
                 this.outcome = [null, null, "Draw"];
                 this.matchStatus=4;
               } 
               else if (this.battingTeamDetails.total < this.bowlingTeamDetails.total) {
                 // Batting team Lost
                 let margin = this.bowlingTeamDetails.total - this.battingTeamDetails.total;
                 this.outcome = [this.bowlingTeamDetails, margin, "Runs"];
                 this.matchStatus=4;
               } 
              else 
               {
                 // Batting team won
                 let margin = this.battingTeamDetails.players.length - this.battingTeamDetails.wickets;
                 this.outcome = [this.battingTeamDetails, margin, "Wickets"];
                 this.matchStatus=4;
               }
             }
          }// If it was first batting team
          else if (this.battingTeamDetails.battingOrder == 1) 
          {
              // End of batting team's innings
              this.outcome = [null, null, "InningsBreak"];
              this.matchStatus=2;
              // If it was the chasing team, find match outcome
          } 
          else 
          {
             if (this.battingTeamDetails.total == this.bowlingTeamDetails.total) 
              {
                // Draw
                this.outcome = [null, null, "Draw"];
                this.matchStatus=4;
              } 
              else if (this.battingTeamDetails.total < this.bowlingTeamDetails.total) {
                // Batting team Lost
                let margin = this.bowlingTeamDetails.total - this.battingTeamDetails.total;
                this.outcome = [this.bowlingTeamDetails, margin, "Runs"];
                this.matchStatus=4;
              } 
              else 
              {
                // Batting team won
                  let margin = this.battingTeamDetails.players.length - this.battingTeamDetails.wickets;
                  this.outcome = [this.battingTeamDetails, margin, "Wickets"];
                  this.matchStatus=4;
              }
          }
        }
        else if(!["Wd","N"].includes(event))
        {
           this.chooseBowler();
        
           this.rotatePlayer();

           this.bowlerDetailsSwap();
        }
        else if(["Wd","N"].includes(event))
        {
          if(this.lastballScore%2==1)
          {
            this.rotatePlayer();
          }
        }
     }
     else if (this.battingTeamDetails.total > this.bowlingTeamDetails.total &&this.battingTeamDetails.battingOrder == 2) 
     {
       const margin = this.battingTeamDetails.players.length - this.battingTeamDetails.wickets;
       this.outcome = [this.battingTeamDetails, margin, "Wickets"];
       this.matchStatus=4;
     }
     else  if((this.battingTeamDetails.players.length - this.battingTeamDetails.wickets)==1)
     {
        if(this.battingTeamDetails.battingOrder == 1)
        {
          this.outcome = [null, null, "InningsBreak"];
          this.matchStatus=2;
        }
        else if(this.battingTeamDetails.battingOrder == 2)
        {
          if (this.battingTeamDetails.total == this.bowlingTeamDetails.total) 
          {
            // Draw
            this.outcome = [null, null, "Draw"];
            this.matchStatus=4;
          } 
          else if (this.battingTeamDetails.total < this.bowlingTeamDetails.total) 
          {
              // Batting team Lost
              let margin = this.bowlingTeamDetails.total - this.battingTeamDetails.total;
              this.outcome = [this.bowlingTeamDetails, margin, "Runs"];
              this.matchStatus=4;
          } 
         else 
          {
            // Batting team won
            let margin = this.battingTeamDetails.players.length - this.battingTeamDetails.wickets;
            this.outcome = [this.battingTeamDetails, margin, "Wickets"];
            this.matchStatus=4;
          }
        }
     }
  }
  onStrikerDetailsUpdate()
  {
    let currentnonStrikerIndex=this.battingTeamDetails.players.findIndex(x=>x.name==this.battingTeamDetails.nonStrikerDetails.name);
    if(currentnonStrikerIndex>-1)
    {
      this.battingTeamDetails.players[currentnonStrikerIndex]=this.battingTeamDetails.nonStrikerDetails;
    }
  }
  onNonStrikerDetailsUpdate()
  {
    let currentstrikerIndex=this.battingTeamDetails.players.findIndex(x=>x.name==this.battingTeamDetails.strikerDetails.name);
    if(currentstrikerIndex>-1)
    {
      this.battingTeamDetails.players[currentstrikerIndex]=this.battingTeamDetails.strikerDetails;
    }
  }
  onBowlerDetailsUpdate()
  {    
    let currentBowlerIndex=this.bowlingTeamDetails.players.findIndex(x=>x.name==this.bowlingTeamDetails.bowlerDetails.name);
     if(currentBowlerIndex>-1)
     {
      this.bowlingTeamDetails.players[currentBowlerIndex]=this.bowlingTeamDetails.bowlerDetails;
     }
  }
  bowlerDetailsSwap()
  {
    [this.bowlingTeamDetails.last_bowlerDetails,this.bowlingTeamDetails.bowlerDetails]= [this.bowlingTeamDetails.bowlerDetails,this.bowlingTeamDetails.last_bowlerDetails];
    this.bowlingTeamDetails.bowlerDetails.isCurrentBowler=false;
  }
  
}
