import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { players } from 'src/app/models/players';
import {team} from 'src/app/models/team';
import { PlayersService } from 'src/app/_services/players.service';
import { TeamsServiceService } from 'src/app/_services/teams-service.service';

@Component({
  selector: 'app-addplayer',
  templateUrl: './addplayer.component.html',
  styleUrls: ['./addplayer.component.css']
})
export class AddplayerComponent implements OnInit {
  playerForm!: FormGroup;
  buttonText:string="Add";
  IsInternational:boolean=false;
  @Input() EditItem!:EventEmitter<players>;
  @Output() OutputItemEvent=new EventEmitter<boolean>();
  player:players={
    playersId: 0,
    jerseyNo: '',
    jerseyName: '',
    name: '',
    dob: new Date(),
    internationalTeam: 0,
    localTeams: 0,
    isLocalPlayer: false,
    domesticTeam: 0,
    isActive: false,
    isDeleated: false
  };
  teams:team[]=[];
  constructor(private fb: FormBuilder,private PlaysServ:PlayersService,private teamService:TeamsServiceService) { }

  ngOnInit(): void {
    this.intitializeForm();
    this.loadDropdown();
    if(this.EditItem)
    {
      this.EditItem.subscribe(data => {
        debugger;
        this.player=data;
        this.playerForm.setValue({  
          Name: data.name,
          IsLocalPlayer: ""+(data.isLocalPlayer)+"",
          InternationalTeam:data.internationalTeam,
          IsActive:data.isActive
         }); 
         this.IsInternational= !data.isLocalPlayer;
         this.buttonText="Update";
      });
    }
  }
  intitializeForm()
  {
    this.playerForm=this.fb.group({
      Name: [''],
      IsLocalPlayer: [''],
      InternationalTeam:[''],
      IsActive:[true]
    });
  }
  loadDropdown()
  {
    this.teamService.getTeams(1,500).subscribe(response => {
      this.teams = response.result;
    });
  }
  OnCheck(rdo:any)
  {
    if(rdo.target.value=="true")
    {
      this.IsInternational=false;
    }
    else{
      this.IsInternational=true;
    }
    
  }
  OnUpdate()
  {
    debugger;
    this.player.name=this.playerForm.controls['Name'].value;
    this.player.isLocalPlayer=!this.IsInternational;
    this.player.isActive=this.playerForm.controls["IsActive"].value;
    if(this.IsInternational)
    {
      this.player.internationalTeam=this.playerForm.controls["InternationalTeam"].value==""?0:this.playerForm.controls["InternationalTeam"].value;
    }
    else{
      this.player.internationalTeam=0;
    }
    this.PlaysServ.updatePlayer(this.player).subscribe(obj=>{
      this.OnReset();
      this.OutputItemEvent.emit(true);
   },err=>{
     console.log(err);
   });
  }
  OnSubmit()
  {
    this.player.name=this.playerForm.controls['Name'].value;
    this.player.isLocalPlayer=!this.IsInternational;
    this.player.isActive=this.playerForm.controls["IsActive"].value;
    this.player.internationalTeam=this.playerForm.controls["InternationalTeam"].value==""?0:this.playerForm.controls["InternationalTeam"].value;

    if(this.buttonText=="Add")
    {
    this.PlaysServ.addPlayer(this.player).subscribe(obj=>{
      this.OnReset();
      this.OutputItemEvent.emit(true);
    },err=>{
      console.log(err);
    })
    }
    else{
      this.OnUpdate()
    }
  }
  OnReset()
  {
    this.playerForm.setValue({  
      Name: [''],
      IsLocalPlayer: [''],
      InternationalTeam:[''],
      IsActive:[true]
     });  
     this.IsInternational=false;
     this.buttonText="Add";
  }

}
