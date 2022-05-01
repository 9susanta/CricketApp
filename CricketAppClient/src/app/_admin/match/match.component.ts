import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatchesService } from 'src/app/_services/matches.service';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {

  constructor(private match:MatchesService,private router:Router) { }

  ngOnInit(): void {
  }
  onCreate()
  {
    this.match.createMatch().subscribe(response => {
      if(response)
      {
        this.router.navigate(['addmatchplayers',response]);
      }
    },err=>{
      debugger;
    });
  }
}
