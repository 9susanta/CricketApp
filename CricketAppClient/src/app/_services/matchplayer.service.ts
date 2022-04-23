import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { matchplayer } from '../models/matchplayer';

@Injectable({
  providedIn: 'root'
})
export class MatchplayerService {

  baseUrl=environment.apiUrl
  constructor(private http:HttpClient) { }

  startMatch(model:any){
    return this.http.post(this.baseUrl+'StartMatch/start-match',model).pipe(map((res:any)=>{
      return res;
    }));
  }
  getMatch(modal:any)
  {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("matchId",modal);
    return this.http.get<matchplayer>(this.baseUrl+'StartMatch/get-matchdetails',{params:queryParams});
  }
  updateMatchScore(model:any){
    return this.http.post(this.baseUrl+'MatchDetails/update-match-details',model).pipe(map((res:any)=>{
      return res;
    }));
  }
}
