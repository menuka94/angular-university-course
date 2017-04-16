import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Lesson} from "./lesson";
import {AngularFire} from "angularfire2";

@Injectable()
export class LessonsService {

  constructor(private af: AngularFire) { }

  findAllLessons(): Observable<Lesson[]>{
    return this.af.database.list('lessons');
  }
}
