import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { players } from '../models/players';
import { getPaginatedResult, getPaginationHeaders } from '../_helpers/paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  baseUrl=environment.apiUrl
  constructor(private http:HttpClient) { }
  addPlayer(model:any){
    return this.http.post(this.baseUrl+'Players/add-player',model).pipe(map((team:any)=>{
      return team;
    }));
  }

  getPlayers(pageNumber:number,pageSize:number)
  {
    let params = getPaginationHeaders(pageNumber, pageSize);
    return getPaginatedResult<players[]>(this.baseUrl + 'Players/get-player', params,this.http)
    .pipe(map(response => {
      return response;
    }))
  }

  updatePlayer(model:any)
  { 
    debugger;
    return this.http.put(this.baseUrl+'Players/update-player/'+model.playersId,model).pipe(map((team:any)=>{
      return team;
    }));
  }

  deletePlayer(id:number)
  {
    let httpParams = new HttpParams().set('id', id);
    let options = { params: httpParams };

    return this.http.delete(this.baseUrl+'Players/delete-player',options).pipe(map((team:any)=>{
      return team;
    }));
  }
}
