import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Course} from "./course";
import {AngularFire} from "angularfire2";

@Injectable()
export class CoursesService {

  constructor(private af: AngularFire) { }

  findAllCourses(): Observable<Course[]>{
    return this.af.database.list('courses')
        .map(Course.fromJsonArray);
  }

  findLessonsForCourse(courseUrl: string){
    console.log(courseUrl);
  }

}
