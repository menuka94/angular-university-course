import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Course} from "./course";
import {AngularFire, AngularFireDatabase} from "angularfire2";
import {Lesson} from "./lesson";

@Injectable()
export class CoursesService {

    constructor(private db: AngularFireDatabase) {
    }

    findAllCourses(): Observable<Course[]> {
        return this.db.list('courses')
            .map(Course.fromJsonArray);
    }

    findCourseByUrl(courseUrl: string): Observable<Course> {
        return this.db.list('courses', {
            query: {
                orderByChild: 'url',
                equalTo: courseUrl
            }
        }).map(results => results[0]);
    }

    findLessonKeysPerUrl(courseUrl: string): Observable<string[]> {
        return this.findCourseByUrl(courseUrl)
            .switchMap(course => this.db.list(`lessonsPerCourse/${course.$key}`))
            .map(lspc => lspc.map(lpc => lpc.$key));
    }

    findAllLessonsForCourse(courseUrl: string): Observable<Lesson[]> {
        return this.findLessonKeysPerUrl(courseUrl)
            .map(lspc => lspc.map(lessonKey => this.db.object('lessons/' + lessonKey)))
            .flatMap(fbObjObs => Observable.combineLatest(fbObjObs));
    }
}
