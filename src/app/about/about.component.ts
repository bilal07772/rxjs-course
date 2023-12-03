import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {concat, fromEvent, interval, noop, observable, Observable, of, timer, merge, Subject, BehaviorSubject} from 'rxjs';
import {delayWhen, filter, map, take, timeout} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';


@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    ngOnInit() {
      
      // subject acting as an observable
        const subject = new BehaviorSubject(0);
        const series$ =subject.asObservable();
         //this new observable is emitting the values (1,2,3) of the subject.
        // Therefore it doesn't have next,error or complete methods
        //This only means that other parts of application will only subscribe
        series$.subscribe(val=>console.log('Early subscription' ,val));
        subject.next(1);
        subject.next(2);
        subject.next(3);
       //subject.complete();
       setTimeout(()=>{
        series$.subscribe(val=>console.log('LATE subscription' ,val));
        subject.next(4);

       },3000);
    }


}






