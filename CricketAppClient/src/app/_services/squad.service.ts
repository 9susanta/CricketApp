import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SquadService {

  baseUrl=environment.apiUrl
  constructor(private http:HttpClient) { }
  addSquadTeam(model:any){
    return this.http.post(this.baseUrl+'Squad/add-squad-team',model).pipe(map((team:any)=>{
      return team;
    }));
  }
  addSquadPlayer(model:any){
    return this.http.post(this.baseUrl+'Squad/add-squad-players',model).pipe(map((team:any)=>{
      return team;
    }));
  }
  getSquad(seriesId:number)
  {
    return this.http.get<any[]>(this.baseUrl+'Squad/get-squad/'+seriesId);
  }
  
}
