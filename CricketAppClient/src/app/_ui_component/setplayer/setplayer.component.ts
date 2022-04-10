import { Component, Input, OnInit } from '@angular/core';
import { matchplayerdetails } from 'src/app/models/matchplayerdetails';

@Component({
  selector: 'app-setplayer',
  templateUrl: './setplayer.component.html',
  styleUrls: ['./setplayer.component.css']
})
export class SetplayerComponent implements OnInit {

  constructor() { }
  @Input() player:matchplayerdetails[]=[]
  ngOnInit(): void {
  }
  
}
