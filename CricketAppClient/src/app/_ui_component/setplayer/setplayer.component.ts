import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { matchplayerdetails } from 'src/app/models/matchplayerdetails';

@Component({
  selector: 'app-setplayer',
  templateUrl: './setplayer.component.html',
  styleUrls: ['./setplayer.component.css']
})
export class SetplayerComponent implements OnInit {

  constructor() { }
  @Input() player:matchplayerdetails[]=[];
  @Output() sendPlayer : EventEmitter <string> = new EventEmitter<string>();
  ngOnInit(): void {
  }
  onplayerselect(item:any)
  {
    this.sendPlayer.emit(item);
  }
  
}
