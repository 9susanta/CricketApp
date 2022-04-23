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
      teamABattingOrder?:number;
      teamBBattingOrder?:number,  
      teamAPlayers?:string,
      teamBPlayers?:string,

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