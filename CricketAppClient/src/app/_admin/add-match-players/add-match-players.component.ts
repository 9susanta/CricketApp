import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { players } from 'src/app/models/players';

@Component({
  selector: 'app-add-match-players',
  templateUrl: './add-match-players.component.html',
  styleUrls: ['./add-match-players.component.css']
})
export class AddMatchPlayersComponent implements OnInit {

  personName:string='';
  persons:string[] = []
  teamA:string[]=[];
  teamB:string[]=[];
  selectedTeam:string='A';
  selectedOver:number=4;
  tossWin:string='';
  tossDecide:string='';
  isdisabled:boolean=false;
 
  constructor(private router: Router) {}
 
  @ViewChild(ModalDirective, { static: false }) modal?: ModalDirective;
  ngOnInit(): void {
  }
  showModal() {
    this.modal?.show();
  }
  hideModal()
  {
    this.modal?.hide();
  }
  addPerson() {
    const name = this.personName.trim();
    if (name && !this.persons.includes(name)) {
      this.persons.push(name);
      if(this.selectedTeam=="A")
      {
        this.teamA.push(name);
      }
      else if(this.selectedTeam=="B")
      {
        this.teamB.push(name);
      }
    }
    else{
      alert('This name already added !');
    }
    this.personName = "";
  }
  selectTeam(team:any)
  {
     this.selectedTeam=team;
  }
  setTotalOvers(value:any) {
    this.selectedOver = value;
  }
  toss(tosswin:any)
  {
    const lengthA = this.teamA.length;
    const lengthB = this.teamB.length;
    if (lengthA < 2 || lengthB < 2) {
      alert("Add minimum 2 players to both teams to continue");
    } 
    else {
     this.tossWin=tosswin;
     this.showModal();
    } 
  }
  tossDecider(decide:any)
  {
    this.tossDecide=decide;
  }
  funconfirm()
  {
    if(this.tossDecide=='')
    {
      alert('Choose a option frist then click on confirm')
    }
    else{
      this.isdisabled=true;
      this.hideModal();
    }
  }
  startMatch()
  {
     this.router.navigate(['scoreboard']);
  }
  allowDrop(ev:any) {
   // ev.preventDefault();
  }

  drag(ev:any) {
   // ev.dataTransfer.setData("text", ev.target.id);
  }

  drop(ev:any) {
   // ev.preventDefault();
    //var data = ev.dataTransfer.getData("text");
    //ev.target.appendChild(document.getElementById(data));
  }

}
