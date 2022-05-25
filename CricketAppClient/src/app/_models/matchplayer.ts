export interface matchplayer
{
      matchDetailsId?:number, 
      matchId?:number 
      teamHomeId?:number 
      teamHomeName?:string, 
      teamVisitingId?:number, 
      teamVisitingName?:string, 
      totalOvers?:number, 
      tossWinTeamId?:number, 
      tossWinTeamName?:string, 
      tossDecideName?:string, 
      tossBatting?:string,
      teamHomeBattingOrder?:number;
      teamVisitingBattingOrder?:number,  
      teamHomePlayers?:string,
      teamVisitingPlayers?:string,

      matchStatus?:string,
      battingFirstScored?:number,
      battingFirstTeamName?:string,
      battingFirstWicketFall?:number,
      battingFirstOverFaced?:string,

      battingSecondtScored?:number,
      battingSecondTeamName?:string,
      battingSecondWicketFall?:number,
      battingSecondOverFaced?:string,

      result?:string,
      currentmatchDetails?:string
}
