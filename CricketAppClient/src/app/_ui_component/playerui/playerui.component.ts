import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-playerui',
  templateUrl: './playerui.component.html',
  styleUrls: ['./playerui.component.css']
})
export class PlayeruiComponent implements OnInit {
  
  constructor() { }
  @Input() name:string='';
  ngOnInit(): void {
  }

}
