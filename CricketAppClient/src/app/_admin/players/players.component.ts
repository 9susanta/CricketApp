import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Pagination } from 'src/app/models/pagination';
import { players } from 'src/app/models/players';
import { PlayersService } from 'src/app/_services/players.service';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {
  
  playerForm!: FormGroup;

  pageNumber:number=1;
  pageSize:number=20;
  players:players[]=[];
  pagination!: Pagination;
  player: EventEmitter<players> = new EventEmitter();
  buttonText:string="Add";


  constructor(private fb: FormBuilder,private playerService:PlayersService) { }

  ngOnInit(): void {
    this.intitializeForm();
    this.loadPlayers();
  }
  intitializeForm()
  {
    this.playerForm=this.fb.group({
      Name: [''],
      IsLocalPlayer: [''],
      InternationalTeam:[''],
      IsActive:[false]
    });
  }
  loadPlayers() {
    this.playerService.getPlayers(this.pageNumber,this.pageSize).subscribe(response => {
      this.players = response.result;
      this.pagination = response.pagination;
    })
  }
  outputFunction(event:any)
  {
    this.loadPlayers();
  }
  pageChanged(event: any)
  {
    this.pageNumber=event.page;
    this.loadPlayers();
  }
 
  OnEdit(item:any)
  {
    this.player.emit(item);
  }
  OnDelete(id:any)
  {
    this.playerService.deletePlayer(id).subscribe(response => {
      this.loadPlayers();
    });
  }

}
