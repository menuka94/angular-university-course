import {Inject, Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Lesson} from "./lesson";
import {AngularFire, FirebaseRef} from "angularfire2";
import {Subject} from "rxjs/Subject";

@Injectable()
export class LessonsService {
    private sdkDb: any;

  constructor(private af: AngularFire, @Inject(FirebaseRef) fb) {
      this.sdkDb = fb.database().ref();
  }

  findAllLessons(): Observable<Lesson[]>{
    return this.af.database.list('lessons')
        .map(Lesson.fromJsonList);
  }

  findLessonByUrl(url: string): Observable<Lesson>{
    return this.af.database.list('lessons',
        {
          query: {
            orderByChild: 'url',
            equalTo: url
          }
        }).map(results => Lesson.fromJson(results[0]));
  }

  loadNextLesson(courseId: string, lessonId: string): Observable<Lesson>{
      return this.af.database.list(`lessonsPerCourse/${courseId}`, {
          query: {
              orderByKey: true,
              startAt: lessonId,
              limitToFirst: 2
          }
      }).map(results => results[1].$key)
          .switchMap(lessonid => this.af.database.object(`lessons/${lessonId}`))
          .map(Lesson.fromJson);
  }

  loadPreviousLesson(courseId: string, lessonId: string): Observable<Lesson> {
      return this.af.database.list(`lessonsPerCourse/${courseId}`, {
          query: {
              orderByKey: true,
              endAt: lessonId,
              limitToLast: 2
          }
      }).map(results => results[0].$key)
          .switchMap(lessonid => this.af.database.object(`lessons/${lessonId}`))
          .map(Lesson.fromJson);
  }

  createNewLesson(courseId: string, lesson: any): Observable<any>{
      let lessonToSave = Object.assign({}, lesson, {courseId});
      let newLessonKey = this.sdkDb.child('lessons').push().key;
      let dataToSave = {};
      dataToSave[`lessons/${newLessonKey}`] = lessonToSave;
      dataToSave[`lessonsPerCourse/${courseId}${newLessonKey}`] = true;

      return this.firebaseUpdate(dataToSave);

  }

  firebaseUpdate(dataToSave){
      const subject = new Subject();
      this.sdkDb.update(dataToSave)
          .then(
              val => {
                  subject.next(val);
                  subject.complete();
              },
              err => {
                  subject.error(err);
                  subject.complete();
              }
          )

      return subject.asObservable();
  }
}
