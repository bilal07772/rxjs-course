import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
export enum RxJSLogginLevel {
    TRACE,
    DEBUG,
    INFO,
    ERROR
}
let logginLevel =RxJSLogginLevel.INFO;
export function setRxJsLogginLevel(level:RxJSLogginLevel):void{
       logginLevel =level;
}

export const debug =(level: number, message: string) =>
 (source: Observable<any>) =>
    source.pipe(
      tap((val) => {
        if(level >= logginLevel) 
        console.log(message + ": ",  val);
      }),
 );
 