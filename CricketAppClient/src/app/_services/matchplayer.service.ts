import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

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
    queryParams = queryParams.append("matchDetailsId",modal);
    return this.http.get(this.baseUrl+'StartMatch/get-matchdetails',{params:queryParams});
  }
}
