import { Injectable } from "@angular/core";
import { Course } from "../model/course";
import { BehaviorSubject, Observable, Subject, of, timer } from "rxjs";
import { createHttpObservable } from "./util";
import { tap, map, shareReplay, retryWhen, delayWhen, filter } from "rxjs/operators";
import { Form, FormArray } from "@angular/forms";
import { fromPromise } from "rxjs/internal/observable/fromPromise";

@Injectable({
    providedIn:'root'
})
export class Store {
    private subject =new BehaviorSubject<Course[]>([]);
    courses$ : Observable<Course[]> =this.subject.asObservable();
    init(){
        const http$ = createHttpObservable('/api/courses');
        http$
            .pipe(
                tap(() => console.log("HTTP request executed")),
                map(res => Object.values(res["payload"]) )
            ).subscribe(
                // Passing the list of courses array to the subject private variable
                courses => this.subject.next(courses)
            )

    }
    selectBeginnerCourse():Observable<Course[]>{
        return this.filterByCategory('BEGINNER');
    }
    selectAdvancedCourse():Observable<Course[]>{
       return  this.filterByCategory('ADVANCED');
    }
    selectCourseDetailsById(courseId:number):Observable<Course>{
        return this.courses$.
        pipe(
            map(courses=> courses.find(course=>course.id==courseId)),
            filter(course=>!!course)
        );

    }
    filterByCategory(category:string):Observable<Course[]>{
        return this.courses$
        .pipe(
            map(courses => courses
                .filter(course => course.category == category))
        );
    }
    saveCourse(courseId:number,changedFormData):Observable<any>{
        // Get reference to the complete array of courses.
       const courses =this.subject.getValue();
       // Above contains list of all course as an array

       // Now search the course with the ID identical to courseId (updated course id)
       // and store the index of that found course into a separate variable
       const courseIndex = courses.findIndex(course=>course.id==courseId);
       // Now we know the position of our amended course .
       // instead of modifying the existing observable value, create a new value of 
       //courses array and emit that value using the subject.
       // ONLY THIS WAY, we can notify the consumers of courses data that new Value is available.

       // create a copy of the existing courses array using NEW ARRAY using slice(0)
       const newCourses =courses.slice(0);  
      
       // Look for the course with course index and assign it a completely new JS object to avoid
       // changing the data that was already passed to component
       // instead we are going to create a new course object
       newCourses[courseIndex] ={
        ...courses[courseId],        //create a copy of the course object using JS spread operator
         // Now to modify this cope with the changes we have received here from UI, we use spread operator on 
         // changedFormData 
         ...changedFormData          
       };
        // Now we have new course values and can braodcast it to our application using the subject.
        this.subject.next(newCourses);
        // THIS COMPLETES IN MEMORY CHANGES IN CLIENT 
        
        //NOW WE NEED TO SAVE THESE CHANGES TO BACKEND.
        return fromPromise(fetch(`/api/courses/${courseId}`,{
            method:'PUT',
            body: JSON.stringify(changedFormData),
            headers:{
                'content-type': 'application/json'
}
        }));

    }
   
}