import { Component, OnInit } from '@angular/core';
import {CoursesService} from "../shared/model/courses.service";
import {Observable} from "rxjs/Observable";
import {Lesson} from "../shared/model/lesson";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  lessons$: Observable<Lesson[]>;

  constructor(private coursesService: CoursesService,
              public route: ActivatedRoute) { }

  ngOnInit() {
    let courseUrl = this.route.snapshot.params['id'];
    this.lessons$ = this.coursesService.findAllLessonsForCourse(courseUrl);
  }

}
