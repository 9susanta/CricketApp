import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { matchplayer } from 'src/app/models/matchplayer';
import { matchplayerdetails } from 'src/app/models/matchplayerdetails';
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

  battingTeam:string = '';
  bowlingTeam:string = '';
  striker:matchplayerdetails = {};
  nonStriker:matchplayerdetails = {};
  bowler:matchplayerdetails = {};

  modalmessage:string="";
  modalName:string="";
  playersSet:matchplayerdetails[]=[];

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
  chooseStriker()
  {
    this.modalmessage="🏏 Choose Striker ?";
    this.modalName="striker";
    this.showModal();
  }
  chooseNonStriker()
  {
    this.modalmessage="🏏 Choose Non-Striker ?";
    this.modalName="nonstriker";
    this.showModal();
  }
  chooseBowler()
  {
    this.modalmessage=" 🥎 Choose Bowler ?";
    this.modalName="bowler";
    this.showModal();
  }
  onConfirm(modalName:string)
  {
      this.hideModal();
      if(modalName=="striker")
      {
        this.chooseNonStriker();
      }
      else if(modalName=="nonstriker")
      {
          this.chooseBowler();
      }
      else if(modalName=="bowler")
      {

      }
  }
}
