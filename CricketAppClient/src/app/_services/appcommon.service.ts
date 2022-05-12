import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppcommonService {

  constructor() { }
  borderClass:string[]=["bdr-color-1","bdr-color-2","bdr-color-3","bdr-color-4",
  "bdr-color-5","bdr-color-6","bdr-color-7","bdr-color-8","bdr-color-9"]
  generateRandom(indx:number)
  {
    return this.borderClass[(indx%9)]
  }
}
