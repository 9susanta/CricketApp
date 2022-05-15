import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { team } from '../_models/team';
import { map } from 'rxjs';
import { getPaginatedResult, getPaginationHeaders } from '../_helpers/paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class TeamsServiceService {
  baseUrl=environment.apiUrl
  constructor(private http:HttpClient) { }
  addTeams(model:any){
    return this.http.post(this.baseUrl+'RegisterTeams/add-teams',model).pipe(map((team:any)=>{
      return team;
    }));
  }

  getTeams(pageNumber:number,pageSize:number)
  {
    let params = getPaginationHeaders(pageNumber, pageSize);
    return getPaginatedResult<team[]>(this.baseUrl + 'RegisterTeams/get-teams', params,this.http)
    .pipe(map(response => {
      return response;
    }))
  }

  updateTeams(model:any)
  {
    const params = new HttpParams().set('id', model.teamId);  
    const headers = new HttpHeaders().set('content-type', 'application/json');  
    var body = {  
                 tblTeams: model
               };  
    return this.http.put(this.baseUrl+'RegisterTeams/update-teams/'+model.teamId,model).pipe(map((team:any)=>{
      return team;
    }));
  }

  deleteTeams(id:number)
  {
    let httpParams = new HttpParams().set('id', id);
    let options = { params: httpParams };

    return this.http.delete(this.baseUrl+'RegisterTeams/delete-teams',options).pipe(map((team:any)=>{
      return team;
    }));
  }

}
