import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { series } from '../models/series';
import { getPaginatedResult, getPaginationHeaders } from '../_helpers/paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {

  baseUrl=environment.apiUrl
  constructor(private http:HttpClient) { }
  addSeries(model:any){
    return this.http.post(this.baseUrl+'Series/add-series',model).pipe(map((team:any)=>{
      return team;
    }));
  }

  getSeries(pageNumber:number,pageSize:number)
  {
    let params = getPaginationHeaders(pageNumber, pageSize);
    return getPaginatedResult<series[]>(this.baseUrl + 'Series/get-series', params,this.http)
    .pipe(map(response => {
      return response;
    }))
  }

  updateSeries(model:any)
  { 
    return this.http.put(this.baseUrl+'Series/update-series/'+model.seriesId,model).pipe(map((team:any)=>{
      return team;
    }));
  }

  deleteSeries(id:number)
  {
    let httpParams = new HttpParams().set('id', id);
    let options = { params: httpParams };

    return this.http.delete(this.baseUrl+'Series/delete-series',options).pipe(map((team:any)=>{
      return team;
    }));
  }
}
