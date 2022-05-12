import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { players } from 'src/app/_models/players';
import {team} from 'src/app/_models/team';
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
  IsLocal:boolean=false;
  @Input() EditItem!:EventEmitter<players>;
  @Output() OutputItemEvent=new EventEmitter<string>();
  player:players={
    playersId: 0,
    jerseyNo: '',
    jerseyName: '',
    name: '',
    role:'',
    dob: new Date(),
    internationalTeam: 0,
    localTeams: 0,
    isLocalPlayer: false,
    domesticTeam: 0,
    isActive: false,
    isDeleated: false
  };
  teams:team[]=[];
  constructor(private fb: FormBuilder,private PlaysServ:PlayersService,
    private teamService:TeamsServiceService,private toastr:ToastrService) { }

  ngOnInit(): void {
    this.intitializeForm();
    this.loadDropdown();
    if(this.EditItem)
    {
      this.EditItem.subscribe(data => {
        this.player=data;
        this.playerForm.setValue({  
          Name: data.name,
          IsLocalPlayer: ""+(data.isLocalPlayer)+"",
          InternationalTeam:data.internationalTeam,
          playerRole:data.role==null?"":data.role,
          IsActive:data.isActive
         }); 
         this.IsLocal=data.isLocalPlayer;
         this.buttonText="Update";
      });
    }
  }
  intitializeForm()
  {
    this.playerForm=this.fb.group({
      Name: ['',[Validators.required,Validators.minLength(3)]],
      playerRole:['',[Validators.required]],
      IsLocalPlayer: ['false',[Validators.required]],
      InternationalTeam:['',[Validators.required]],
      IsActive:[true,Validators.required]
    });
  }
  loadDropdown()
  {
    this.teamService.getTeams(1,1500).subscribe(response => {
      this.teams = response.result;
    });
  }

  OnCheck(rdo:any)
  {
    if(rdo.target.value=="true")
    {
      this.IsLocal=true;
    }
    else{
      this.IsLocal=false;
    }
  }
 
  onUpdate()
  {
    
    this.player.name=this.playerForm.controls['Name'].value;
    this.player.isLocalPlayer=this.IsLocal;
    this.player.role=this.playerForm.controls["playerRole"].value;
    this.player.isActive=this.playerForm.controls["IsActive"].value;
    this.player.internationalTeam=this.playerForm.controls["InternationalTeam"].value==""?0:this.playerForm.controls["InternationalTeam"].value;
    
    this.PlaysServ.updatePlayer(this.player).subscribe(obj=>{
      this.toastr.success('Update Player', 'Update successfully !');
      this.OnReset();
      this.OutputItemEvent.emit("update");
   });
  }
  OnSubmit()
  {
    if(this.playerForm.status=='INVALID')
    {
      this.toastr.warning('Enter all the field !')
      return;
    }
    if(this.buttonText=="Add")
    {
      this.player.name=this.playerForm.controls['Name'].value;
      this.player.isLocalPlayer=this.IsLocal;
      this.player.role=this.playerForm.controls["playerRole"].value;
      this.player.isActive=this.playerForm.controls["IsActive"].value;
      this.player.internationalTeam=this.playerForm.controls["InternationalTeam"].value==""?0:this.playerForm.controls["InternationalTeam"].value;

       this.PlaysServ.addPlayer(this.player).subscribe(obj=>{
         if(obj=="1")
         {
           this.toastr.success('Add Player', 'Added successfully !');
           this.OnReset();
            this.OutputItemEvent.emit("add");
          }
          else
          {
            this.toastr.warning('Add Player', 'Player Name already exist !');
          }
        })
    }
    else{
      this.onUpdate()
    }
  }
  OnReset()
  {
    this.playerForm.setValue({  
      Name: '',
      playerRole:'',
      IsLocalPlayer: 'false',
      InternationalTeam:'',
      IsActive:true
     });  
     this.buttonText="Add";
     this.IsLocal=false;
     this.OutputItemEvent.emit("reset");
  }
}
