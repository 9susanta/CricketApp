import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { matchplayer } from 'src/app/models/matchplayer';
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

  currentmatchDetails:any;

  matchStatus:number=0;

  battingTeamDetails:teamdetails=new teamdetails();
  bowlingTeamDetails:teamdetails=new teamdetails();
  
  constructor(private route: ActivatedRoute,private matchplayer:MatchplayerService) { }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get("id");
    this.matchplayer.getMatch(id).subscribe(async response => {
      debugger;
      this.match_player=response;
      this._match_id=this.match_player.matchId!;
      this.totover=this.match_player.totalOvers!;

      if(this.match_player.currentmatchDetails!=null)
      {
         this.currentmatchDetails=JSON.parse(this.match_player.currentmatchDetails!);
         this.matchStatus=this.currentmatchDetails.matchStatus;
         
         this.battingTeamDetails=this.currentmatchDetails.battingTeamDetails;
         this.bowlingTeamDetails=this.currentmatchDetails.bowlingTeamDetails;

         console.log(this.battingTeamDetails)
         console.log(this.bowlingTeamDetails)
      }
      //this.matchplayer.createHubConnection(this._match_id);
    })
    this.matchplayer.messageThreadSource.subscribe(res=>{
      //console.log(res);
    })
  }
}
