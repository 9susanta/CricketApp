import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { matchplayer } from 'src/app/models/matchplayer';
import { matchplayerdetails } from 'src/app/models/matchplayerdetails';
import { teamdetails } from 'src/app/models/teamdetails';
import { MatchplayerService } from 'src/app/_services/matchplayer.service';

@Component({
  selector: 'app-scorecard',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.css']
})
export class ScorecardComponent implements OnInit {

  _match_id:number=0;
  match_player:matchplayer={};

  totover:number=0;
  outcome:any=[null,null,null];

  currentmatchDetails:any={};

  matchStatus:number=0;

  matchmsg:string="";

  battingTeamDetails:teamdetails=new teamdetails();
  bowlingTeamDetails:teamdetails=new teamdetails();

  didBatFristArr:matchplayerdetails[]=[];
  didnotBatFristArr:matchplayerdetails[]=[];

  bowlFirstData:matchplayerdetails[]=[];

  didBatSecArr:matchplayerdetails[]=[];
  didnotBatSecArr:matchplayerdetails[]=[];

  bowlSecData:matchplayerdetails[]=[];

  didNotBatMsg:string="Yet to Bat";
  
  constructor(private route: ActivatedRoute,private matchplayer:MatchplayerService) { }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get("id");
    this.matchplayer.getMatch(id).subscribe(async response => {
      this.match_player=response;
      this._match_id=this.match_player.matchId!;
      this.totover=this.match_player.totalOvers!;
      this.currentmatchDetails=JSON.parse(this.match_player.currentmatchDetails!);

      if(this.currentmatchDetails.battingTeamDetails.battingOrder==1)
      {
        this.matchmsg=this.match_player.tossWinTeamName+" "+" won the toss and decide to "+this.match_player.tossDecideName+" frist";
      }
      else if(this.currentmatchDetails.battingTeamDetails.battingOrder==2)
      {
        this.matchmsg=this.currentmatchDetails.battingTeamDetails.name+" need "+((this.currentmatchDetails.bowlingTeamDetails.total+1)-this.currentmatchDetails.battingTeamDetails.total)+" runs in "+((this.currentmatchDetails.battingTeamDetails.totOver*6)-this.currentmatchDetails.battingTeamDetails.overs) +" balls";
      }
      this.updateScore();
      if(this.matchStatus!=4)
      {
         this.matchplayer.createHubConnection(this._match_id);
      }
    })
    this.matchplayer.messageThreadSource.subscribe(res=>{
      if(res.currentmatchDetails!="")
      {
         this.currentmatchDetails=JSON.parse(res.currentmatchDetails);
         this.updateScore();
      }
    })
  }
  updateScore()
  {
    if(this.currentmatchDetails!=null)
    {
       this.matchStatus=this.currentmatchDetails.matchStatus;
       this.battingTeamDetails=this.currentmatchDetails.battingTeamDetails;
       this.bowlingTeamDetails=this.currentmatchDetails.bowlingTeamDetails;
      if(this.battingTeamDetails.battingOrder==1)
      {
        this.matchmsg=this.match_player.tossWinTeamName+" "+" won the toss and decide to "+this.match_player.tossDecideName+" frist";
      }
      else if(this.battingTeamDetails.battingOrder==2)
      {
        if(["Draw","Runs","Wickets"].includes(this.currentmatchDetails.outcome[2]))
         {
          if(this.currentmatchDetails.outcome[2]=="Draw")
          {
            this.matchmsg="The match is draw";
          }
          else if(this.currentmatchDetails.outcome[2]=="Runs")
          {
            this.matchmsg=`${this.bowlingTeamDetails.name}`+' Won by '+`${this.currentmatchDetails.outcome[1]}`+' Run';
          }  
          else if(this.currentmatchDetails.outcome[2]=="Wickets")
          {
            this.matchmsg=`${this.battingTeamDetails.name}`+' Won by '+`${this.currentmatchDetails.outcome[1]}`+' Wickets';
          } 
          this.didNotBatMsg="Did not Bat";
        }
        else
        {
            this.matchmsg=this.battingTeamDetails.name+" need "+((this.bowlingTeamDetails.total+1)-this.battingTeamDetails.total)+" runs in "+((this.match_player.totalOvers!*6)-this.battingTeamDetails.overs) +" balls";
        }
      }
      if(this.battingTeamDetails.battingOrder==1)
      {
           this.didBatFristArr=this.battingTeamDetails.players.sort((a, b) => {
            return a.battingNo - b.battingNo;
           }).filter(x=>x.battingNo>0);

           this.didnotBatFristArr=this.battingTeamDetails.players.filter(x=>x.battingNo==0);

           this.bowlFirstData=this.bowlingTeamDetails.players.sort((a, b) => {
            return a.bowlingNo - b.bowlingNo;
           }).filter(x=>x.bowlingNo>0);
      }
      else if(this.battingTeamDetails.battingOrder==2)
      {
        this.didBatFristArr=this.bowlingTeamDetails.players.sort((a, b) => {
          return a.battingNo - b.battingNo;
         }).filter(x=>x.battingNo>0);

         this.didnotBatFristArr=this.bowlingTeamDetails.players.filter(x=>x.battingNo==0);

         this.bowlFirstData=this.battingTeamDetails.players.sort((a, b) => {
          return a.bowlingNo - b.bowlingNo;
         }).filter(x=>x.bowlingNo>0);

         this.didBatSecArr=this.battingTeamDetails.players.sort((a, b) => {
          return a.battingNo - b.battingNo;
         }).filter(x=>x.battingNo>0);

         this.didnotBatSecArr=this.battingTeamDetails.players.filter(x=>x.battingNo==0);

         this.bowlSecData=this.bowlingTeamDetails.players.sort((a, b) => {
          return a.bowlingNo - b.bowlingNo;
         }).filter(x=>x.bowlingNo>0);
       }
    }
  }
}
