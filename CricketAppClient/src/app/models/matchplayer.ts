export interface matchplayer
{
      matchDetailsId?:number, 
      matchId?:number 
      teamAId?:number 
      teamAName?:string, 
      teamBId?:number, 
      teamBName?:string, 
      totalOvers?:number, 
      tossWinTeamId?:number, 
      tossWinTeamName?:string, 
      tossDecideName?:string, 
      tossBatting?:string,
      teamABattingNoAtToss?:number;
      teamBBattingNoAtToss?:number,  
      teamAPlayers?:string,
      teamBPlayers?:string
}