import { matchplayerdetails } from "./matchplayerdetails";

export class teamdetails
{
    name:string='';
    total:number=0;
    overs:number=0;
    totOver:number=0;
    wickets:number=0;
    extra:number=0;
    wide:number=0;
    lb:number=0;
    b:number=0;
    nb:number=0;
    penalty:number=0;
    overInTxt:string='0.0';
    runRate:string='0.0';
    requiredRunRate:string='0.0';
    battingOrder:number=0;
    players:matchplayerdetails[]=[];
    strikerDetails:matchplayerdetails=new matchplayerdetails();
    nonStrikerDetails:matchplayerdetails=new matchplayerdetails();
    bowlerDetails:matchplayerdetails=new matchplayerdetails();
    last_bowlerDetails:matchplayerdetails=new matchplayerdetails();
    fallOfWickets:string[]=[];
    lastFiveOverScore:string[]=[];
    patnership:string[]=[];
    powerPlay:string[]=[];
}