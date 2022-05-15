import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl,FormBuilder,FormGroup,FormControl, Validators} from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Pagination } from 'src/app/_models/pagination';
import { team } from 'src/app/_models/team';
import { AppcommonService } from 'src/app/_services/appcommon.service';
import { ConfirmService } from 'src/app/_services/confirm.service';
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

  @ViewChild('teamsModal', { static: false }) modal?: ModalDirective;

  constructor(private fb: FormBuilder,private teamService:TeamsServiceService,
    private toastr:ToastrService,private confirmService:ConfirmService,
    private appcommonService:AppcommonService) { }

  ngOnInit() {
    this.intitializeForm()
    this.pageSize=16;
    this.loadTeams();
  }

  intitializeForm()
  {
    this.teamForm=this.fb.group({
      teamName: ['',[Validators.required, Validators.minLength(3)]],
      teamTypeId: ['',[Validators.required]]
    });
  }
  onShow()
  {
    this.OnReset();
    this.modal?.show();
  }
  onClose()
  {
     this.OnReset();
     this.modal?.hide();
  }
  getappcommonService(indx:number)
  {
    return this.appcommonService.generateRandom(indx);
  }
  
  OnSubmit()
  {
    if(this.teamForm.status=='INVALID')
    {
      this.toastr.warning('Enter all the field !')
      return;
    }
    if(this.buttonText=="Add")
    {
    this.teamService.addTeams(this.teamForm.value).subscribe(obj=>{
      if(obj=="1")
      {
        this.toastr.success('Add Tournament', 'Added successfully !');
        this.onClose();
        this.OnReset()
        this.loadTeams();
      }
      else
      {
       this.toastr.error('Add Tournament', 'Tournament exist !');
      }
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
    this.onShow()
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
      this.toastr.success('Update Team', 'Updated successfully !');
      this.OnReset();
      this.onClose();
      this.loadTeams();
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
    this.confirmService.confirm('Confirm delete').subscribe(result => {
      if (result) {
        this.teamService.deleteTeams(id).subscribe(response => {
          if(response==true)
          {
            this.toastr.success('Removed Team', 'Removed successfully !');
            this.loadTeams();
          }
        });
      }
    })
  }
}
