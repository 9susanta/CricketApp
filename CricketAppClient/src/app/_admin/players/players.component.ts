import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Pagination } from 'src/app/_models/pagination';
import { players } from 'src/app/_models/players';
import { AppcommonService } from 'src/app/_services/appcommon.service';
import { ConfirmService } from 'src/app/_services/confirm.service';
import { PlayersService } from 'src/app/_services/players.service';
import { AddplayerComponent } from 'src/app/_ui_component/addplayer/addplayer.component';

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

  @ViewChild('playerModal', { static: false }) modal?: ModalDirective;

  @ViewChild(AddplayerComponent,{static:false}) child!: AddplayerComponent ;


  constructor(private fb: FormBuilder,private playerService:PlayersService,private confirmService:ConfirmService,
    private appcommonService:AppcommonService,private toastr:ToastrService) { }

  ngOnInit(): void {
    this.loadPlayers();
  }
  onShow()
  {
    this.modal?.show();
  }
  onClose()
  {
     this.child.OnReset();
     this.modal?.hide();
  }
  getappcommonService(indx:number)
  {
    return this.appcommonService.generateRandom(indx);
  }
  loadPlayers() {
    this.playerService.getPlayers(this.pageNumber,this.pageSize).subscribe(response => {
      this.players = response.result;
      this.pagination = response.pagination;
    })
  }
  outputFunction(event:string)
  {
    if(event=="update"||event=="add"||event=="delete")
    {
      this.loadPlayers();
      this.onClose();
    }
    else if(event=="reset")
    {
      // this.onClose();
    }
  }
  pageChanged(event: any)
  {
    this.pageNumber=event.page;
    this.loadPlayers();
  }
 
  OnEdit(item:any)
  {
    this.onShow();
    this.player.emit(item);
  }
  OnDelete(id:any)
  {
    this.confirmService.confirm('Confirm delete').subscribe(result => {
      if (result) {
        this.playerService.deletePlayer(id).subscribe(response => {
          if(response==true)
          {
            this.toastr.success('Remove Player', 'Removed successfully !');
            this.loadPlayers();
          }
        });
      }
    })
  }
}
