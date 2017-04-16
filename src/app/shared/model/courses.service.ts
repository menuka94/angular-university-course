import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Course} from "./course";
import {AngularFireDatabase} from "angularfire2";
import {Lesson} from "./lesson";
import {FirebaseListFactoryOpts} from "angularfire2/interfaces";

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

    findLessonKeysPerCourseUrl(courseUrl: string,
                               query: FirebaseListFactoryOpts = {}): Observable<string[]> {
        return this.findCourseByUrl(courseUrl)
            .switchMap(course => this.db.list(`lessonsPerCourse/${course.$key}`, query))
            .map(lspc => lspc.map(lpc => lpc.$key));
    }

    findLessonsForLessonKeys(lessonKeys$: Observable<string[]>): Observable<Lesson[]>{
        return lessonKeys$
            .map(lspc => lspc.map(lessonKey => this.db.object('lessons/' + lessonKey)))
            .flatMap(fbObjs => Observable.combineLatest(fbObjs));
    }

    findAllLessonsForCourse(courseUrl: string): Observable<Lesson[]> {
        return this.findLessonsForLessonKeys(this.findLessonKeysPerCourseUrl(courseUrl));
    }

    loadFirstLessonsPage(courseUrl: string, pageSize: number): Observable<Lesson[]>{
        let firstPageLessonKeys$ = this.findLessonKeysPerCourseUrl(courseUrl,
            {
                query: {
                    limitToFirst: pageSize
                }
            });
        return this.findLessonsForLessonKeys(firstPageLessonKeys$);
    }

    loadNextPage(courseUrl: string, lessonKey: string, pageSize: number): Observable<Lesson[]>{
        let lessonKeys$ = this.findLessonKeysPerCourseUrl(courseUrl,
            {
                query: {
                    orderByKey: true,
                    startAt: lessonKey,
                    limitToFirst: pageSize + 1
                }
            });

        return this.findLessonsForLessonKeys(lessonKeys$)
            .map(lessons => lessons.slice(1, lessons.length));
    }

    loadPreviousPage(courseUrl: string, lessonKey: string, pageSize: number): Observable<Lesson[]>{
        let lessonKeys$ = this.findLessonKeysPerCourseUrl(courseUrl,
            {
                query: {
                    orderByKey: true,
                    endAt: lessonKey,
                    limitToLast: pageSize + 1
                }
            });

        return this.findLessonsForLessonKeys(lessonKeys$)
            .map(lessons => lessons.slice(0, lessons.length -1));
    }
}
