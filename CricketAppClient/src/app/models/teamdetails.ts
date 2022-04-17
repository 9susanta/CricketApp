export class teamdetails
{
    name:string='';
    total:number=0;
    _overs:number=0;
    wickets:number=0;
    extra:number=0;
    wide:number=0;
    lb:number=0;
    b:number=0;
    nb:number=0;
    penalty:number=0;
    overInTxt:string='0.0';
    get overs(): number {
        return this._overs;
    }
    set overs(value: number) {
        this._overs = value;
        this.overInTxt=`${Math.floor(this._overs / 6)}.${this._overs % 6}`
    }
}