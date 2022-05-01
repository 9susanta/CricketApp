import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, map, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { matchplayer } from '../models/matchplayer';
import { scoreupdatemodel } from '../models/scoreupdatemodel';

@Injectable({
  providedIn: 'root'
})
export class MatchplayerService {

  baseUrl=environment.apiUrl;
  hubUrl=environment.hubUrl;

  private hubConnection!: HubConnection;

  public messageThreadSource = new BehaviorSubject<scoreupdatemodel>(new scoreupdatemodel());
  messageThread$ = this.messageThreadSource.asObservable();
  
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

  stopHubConnection() {
    if(this.hubConnection)
    {
      this.messageThreadSource.next(new scoreupdatemodel());
      this.hubConnection.stop();
    }
  }
  async sendLivescore(model:any) {
    return this.hubConnection.invoke('SendScore', model)
      .catch(error => console.log(error));
  }
  createHubConnection(matchId:any) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'livescoreupdate?matchId=' + matchId)
      .withAutomaticReconnect()
      .build()

    this.hubConnection.start()
    .catch(error => console.log(error))
    .finally(() =>{});

    // this.hubConnection.on('ReceiveLiveScoreThread', livescore => {
    //   console.log(livescore);
    //   this.messageThreadSource.next(livescore);
    // })

    this.hubConnection.on('NewScore', livescore => {
        this.messageThreadSource.next(livescore)
    });
  }
}
