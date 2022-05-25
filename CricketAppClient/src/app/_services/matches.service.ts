import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { getPaginatedResult, getPaginationHeaders } from '../_helpers/paginationHelper';
import { match } from '../_models/match';

@Injectable({
  providedIn: 'root'
})
export class MatchesService {

  baseUrl=environment.apiUrl
  constructor(private http:HttpClient) { }
  saveMatch(matches:match){
    return this.http.post(this.baseUrl+'matches/add-match',matches).pipe(map((res:any)=>{
      return res;
    }));
  }
  getMatch(pageNumber:number,pageSize:number,seriesId:number)
  {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params=params.append('seriesId',seriesId);
    return getPaginatedResult<match[]>(this.baseUrl + 'matches/get-match', params,this.http)
    .pipe(map(response => {
      return response;
    }))
  }
  getmatchbyId(matchId:number)
  {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("matchId",matchId);
    return this.http.get<match>(this.baseUrl+'matches/get-matchdetails-byid',{params:queryParams});
  }
  getMatchType(seriesTypeId:number)
  {
     if(seriesTypeId==1)
     {
      let matchTypes = [
        { Id: 1, name: 'ODI' },
        { Id: 2, name: 'T20I' },
        { Id: 3, name: 'Test' }
      ];
      return matchTypes;
     }
     else if(seriesTypeId==2)
     {
      let matchTypes = [
        { Id: 4, name: 'ODI' },
        { Id: 5, name: 'T20I' },
        { Id: 6, name: '4 Days Match' },
        { Id: 7, name: 'Custom' }
      ];
      return matchTypes;
     }
     else if(seriesTypeId==3)
     {
      let matchTypes = [
        { Id: 8, name: 'T20' },
        { Id: 9, name: 'T10' }
      ];
      return matchTypes;
     }
     return [];
  }
}
