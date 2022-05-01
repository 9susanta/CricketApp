import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatchesService {

  baseUrl=environment.apiUrl
  constructor(private http:HttpClient) { }
  createMatch(){
    return this.http.get(this.baseUrl+'Matches/get-new-match').pipe(map((res:any)=>{
      return res;
    }));
  }
}
