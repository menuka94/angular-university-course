import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LessonsService} from "../shared/model/lessons.service";
import {Lesson} from "../shared/model/lesson";
import * as _ from 'lodash';

@Component({
  selector: 'app-lesson-detail',
  templateUrl: './lesson-detail.component.html',
  styleUrls: ['./lesson-detail.component.css']
})
export class LessonDetailComponent implements OnInit {
  lesson: Lesson;

  constructor(private route: ActivatedRoute,
              private lessonsService: LessonsService,
              private router: Router) {
    console.log('lesson detail created');
  }

  ngOnInit() {
    this.route.params
        .switchMap(params => {
          let lessonUrl = params['id'];
          return this.lessonsService.findLessonByUrl(lessonUrl);
        })
        .subscribe(lesson => this.lesson = lesson);
  }

  next(){
    console.log('lesson detail next()');
    this.lessonsService.loadNextLesson(this.lesson.courseId, this.lesson.$key)
        .subscribe(lesson => this.navigateToLesson(lesson, this));
  }

  previous(){
    console.log('lesson detail previous()');
    this.lessonsService.loadPreviousLesson(this.lesson.courseId, this.lesson.$key)
        .subscribe(lesson => this.navigateToLesson(lesson, this));
  }

  navigateToLesson(lesson: Lesson, thisInstance: LessonDetailComponent){
    thisInstance.router.navigate(['lessons', lesson.url]);
  }

  delete(){
      this.lessonsService.requestLessonDeletion(this.lesson.$key, this.lesson.courseId);
  }

}
