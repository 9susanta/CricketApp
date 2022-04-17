export class matchplayerdetails
{
    playerId:number=0;
    name:string="";
    runs_score:number=0;
    balls_faced:number=0;
    fours:number=0;
    sixes:number=0;
    strike_rate:string="0.0";
    out:boolean=false
    _overs_bowl:number=0;
    overs_bowl_display:string="0.0";
    runs_given:number=0;
    wickets_taken:number=0;
    maiden_over:number=0;
    economy:string="0.0";
    isBatted:boolean=false;
    isBowled:boolean=false;
    isStriker:boolean=false;
    isNonStriker:boolean=false;
    isCurrentBowler:boolean=false;

    get overs_bowl(): number {
        return this._overs_bowl;
    }
    set overs_bowl(value: number) {

        this._overs_bowl = value;
        this.overs_bowl_display=`${Math.floor(this._overs_bowl / 6)}.${this._overs_bowl % 6}`
    }
}