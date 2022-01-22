import { Component, OnInit } from '@angular/core';
import { AbstractControl,FormBuilder,FormGroup,FormControl} from '@angular/forms';
import { Pagination } from 'src/app/models/pagination';
import { team } from 'src/app/models/team';
import { TeamsServiceService } from 'src/app/_services/teams-service.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {

  teamForm!: FormGroup;

  pageNumber:number=1;
  pageSize:number=20;
  teams:team[]=[];
  pagination!: Pagination;
  team!:team;
  buttonText:string="Add";

  constructor(private fb: FormBuilder,private teamService:TeamsServiceService) { }

  ngOnInit() {
    this.intitializeForm()
    this.pageSize=20;
    this.loadTeams();
  }

  intitializeForm()
  {
    this.teamForm=this.fb.group({
      teamName: [''],
      teamTypeId: ['']
    });
  }
  
  OnSubmit()
  {
    if(this.buttonText=="Add")
    {
    this.teamService.addTeams(this.teamForm.value).subscribe(obj=>{
      this.OnReset()
    },err=>{
      console.log(err);
    })
    }
    else{
      this.OnUpdate()
    }
  }
  loadTeams() {
    this.teamService.getTeams(this.pageNumber,this.pageSize).subscribe(response => {
      this.teams = response.result;
      this.pagination = response.pagination;
    })
  }
  pageChanged(event: any)
  {
    this.pageNumber=event.page;
    this.loadTeams();
  }
  OnEdit(item:any)
  {
    debugger;
    this.team=item;
    this.teamForm.setValue({  
      teamName: item.teamName,  
      teamTypeId: item.teamTypeId,
     });  
     this.buttonText="Update";
  }
  OnUpdate()
  {
    this.team.teamName=this.teamForm.controls['teamName'].value 
    this.team.teamTypeId=this.teamForm.controls['teamTypeId'].value 
    this.teamService.updateTeams(this.team).subscribe(obj=>{
      this.OnReset();
      this.loadTeams();
   },err=>{
     console.log(err);
   });
  }
  OnReset()
  {
    this.teamForm.setValue({  
      teamName: '',  
      teamTypeId: '',
     }); 
     this.buttonText="Add";
  }
  OnDelete(id:any)
  {
    this.teamService.deleteTeams(id).subscribe(response => {
      if(response==true)
      {
        this.loadTeams();
      }
    });
  }
}
