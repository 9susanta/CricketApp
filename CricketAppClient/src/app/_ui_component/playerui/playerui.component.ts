import { Component, Input, OnInit } from '@angular/core';
import { matchplayerdetails } from 'src/app/models/matchplayerdetails';

@Component({
  selector: 'app-playerui',
  templateUrl: './playerui.component.html',
  styleUrls: ['./playerui.component.css']
})
export class PlayeruiComponent implements OnInit {
  
  constructor() { }
  @Input() player:matchplayerdetails=new matchplayerdetails();
  ngOnInit(): void {
  }

}
